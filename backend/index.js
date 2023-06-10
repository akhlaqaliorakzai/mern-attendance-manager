const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

const Users = require("./models/users.model");
const Attendance = require("./models/attendance.model");
const UserReports = require("./models/users.reports.model");
const SystemReports = require("./models/system.reports.model");
mongoose.connect('mongodb://localhost:27017/AMS', {useNewUrlParser: 'true'});

app.post('/api/register', async (req, res)=>{
    
    const {name, email, id, password} = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10)
    try{
        await Users.create({
            name: name,
            email: email,
            id: id,
            password: encryptedPassword,
        })
        res.status(200).json({status: "ok", message:"user registered successfully"})
    }
    catch(err){
        res.status(400).json({error:"user already exists"});
    }
    

})

app.post('/api/sign-in', async (req, res)=>{
    
    const { email,password } = req.body;

    const user = await Users.findOne({email: email});
    if(!user){
        return res.status(400).json({error: "user not found"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(isPasswordValid){
        const token = jwt.sign({
            name: user.name,
            email: user.email,
            id: user.id,
        },
        'secret786'
        )
        return res.json({status:'ok', user: token})
    }
    else{
        return res.status(400).json({error: "user not found"});
    }
    
})

app.post('/api/mark-attendance', async (req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const decodedUser = jwt.verify(token, 'secret786')
        const email = decodedUser.email;
        const {date, mark} = req.body;
        const attendance = await Attendance.findOne({email: email, date:date})
        if(attendance){
            return res.status(400).json({error: "Attendance already marked for the given date"})
        }
        else{
            await Attendance.create({
                email : email,
                date: date,
                mark: mark,
            })
            return res.json({status:'ok'})
        }

    }
    catch(err){
        res.status(400).json({error: err})
    }
})

app.get('/api/all-attendances', async (req, res)=>{

    const token = req.headers['x-access-token'];
    try{
        const decodedUser = jwt.verify(token, 'secret786')
        const email = decodedUser.email;

        const totalCount = await Attendance.countDocuments({email: email})
        const totalPresent = await Attendance.countDocuments({email: email, mark:"Present"});
        const totalAbsent = await Attendance.countDocuments({email: email, mark:"Absent"});
        const totalLeave = await Attendance.countDocuments({email: email, mark:"Leave"});
        const totalPending = await Attendance.countDocuments({email: email, mark:"Pending"});

        const attendance = await Attendance.find({email: email})
        res.json({
            status: 'ok', 
            data: attendance, 
            totalCount: totalCount, 
            totalPresent: totalPresent, 
            totalAbsent: totalAbsent, 
            totalLeave: totalLeave, 
            totalPending: totalPending,
        })

    }
    catch(err){
        res.status(400).json({error: err})
    }
})

app.post('/api/mark-leave', async (req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const decodedUser = jwt.verify(token, 'secret786')
        const email = decodedUser.email;
        const {date, leaveRequest} = req.body;
        const attendance = await Attendance.findOne({email: email, date:date})
        if(attendance){
            return res.status(400).json({error: "Attendance already marked for the given date"})
        }
        else{
            await Attendance.create({
                email : email,
                date: date,
                mark: leaveRequest,
            })
            return res.json({status:'ok'})
        }

    }
    catch(err){
        res.status(400).json({error: err})
    }
})
app.post('/api/upload-image', async (req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const {url} = req.body;
        const decodedUser = jwt.verify(token, 'secret786')
        const email = decodedUser.email;
        const isImageExists = await Users.findOne({image:{$exists : false}})
        
        if(isImageExists){
            // console.log("exists")
            await Users.updateOne({image: isImageExists.image},{$set:{image: url}})
            
        }
        else{
            // console.log("not esixts")
            await Users.updateOne({email: email}, {$set:{image: url}})
            
        }

        res.json({status:'ok'})
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})
app.get('/api/image', async(req, res)=>{
    const token = req.headers['x-access-token'];
    try{
        const {url} = req.body;
        const decodedUser = jwt.verify(token, 'secret786')
        const email = decodedUser.email;
        const user = await Users.findOne({email: email})
        if(user.image){
            res.json({status:'ok', image: user.image})
        }
        else{
            res.status(400).json({error:"image not available"})
        }
    }
    catch(err){
        res.status(400).json({err})
    }
})

app.get('/api/dashboard-content', async(req, res)=>{
    try{

        const users = await Users.find({name:{$ne:'admin'}});
        const totalUsers = await Users.countDocuments()-1;

        const totalLeaveRequests = await Attendance.countDocuments({mark:'Pending'})

        const totalSystemReports = await SystemReports.countDocuments();

        const data = await Promise.all( users.map(async (user)=>{
            const attendances = await Attendance.find({email: user.email})
            user.attendances = []
            attendances.forEach(attendance=>{
                user.attendances.push({mark: attendance.mark, date: attendance.date});
            })
            return user;
        })
        )
        const dashboardContent = data.map((item)=>{
            return item = {name: item.name, email: item.email, id: item.id, attendance: item.attendances}
        })
        res.json({
            status:'ok', 
            data: dashboardContent, 
            totalUsers: totalUsers, 
            totalLeaveRequests: totalLeaveRequests,
            totalSystemReports: totalSystemReports,
        })
        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/create-report', async (req, res)=>{
    const { fullStartDate, fullEndDate, email } = req.body;
    try{
        const attendances = await Attendance.find({email:email});
        
        const userReports = await UserReports.find({email: email, startDate:fullStartDate, endDate: fullEndDate})
        if(userReports.length>0){
            return res.json(400).status({error:"Report Already Exists"});
        }
        const totalAttendance = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, email: email})
        const totalPresent = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, mark:"Present", email: email})
        const totalAbsent = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, mark:"Absent", email: email})
        const totalLeave = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, mark:"Leave", email: email})
        const totalLeavePending = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, mark:"Pending", email: email})

        await UserReports.create({
            email: email,
            startDate: fullStartDate,
            endDate: fullEndDate,
            totalAttendance: totalAttendance,
            totalPresent: totalPresent,
            totalAbsent: totalAbsent,
            totalLeave: totalLeave,
            totalLeavePending: totalLeavePending,

        })
        res.json({status:"ok", message: "record successfully created"})
        
    }
    catch(err){
        res.status(400).json({err});
    }
})

app.post('/api/reports', async(req, res)=>{
    try{
        const {email} = req.body;
        const reports = await UserReports.find({email: email})
        res.json({status:'ok', data: reports})
        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/delete-user', async(req, res)=>{
    try{
        const {email} = req.body;
        await Users.deleteOne({email: email})
        await Attendance.deleteMany({email: email})
        await UserReports.deleteMany({email: email})
        res.json({status:'ok'})

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/delete-attendance', async(req, res)=>{
    try{
        const {email, date} = req.body;
        await Attendance.deleteOne({email: email, date:date})
        res.json({status:'ok'})

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/update-attendance', async(req, res)=>{
    try{
        const {email, date,oldMark, mark} = req.body;
        await Attendance.updateOne({email: email, date:date, mark: oldMark},{mark:mark})
        res.json({status:'ok'})

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/add-user-attendance', async(req, res)=>{
    try{
        const {email, date, mark} = req.body;
        // console.log(email, date, mark)
        await Attendance.create({
            email: email, 
            date:date, 
            mark:mark
        })
        res.json({status:'ok'})

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})


app.get('/api/view-records-content', async(req, res)=>{
    try{

        const users = await Users.find({name:{$ne:'admin'}});

        const data = await Promise.all( users.map(async (user)=>{
            const attendances = await Attendance.find({email: user.email})
            user.attendances = []
            attendances.forEach(attendance=>{
                user.attendances.push({mark: attendance.mark, date: attendance.date});
            })
            return user;
        })
        )
        const viewRecordsContent = data.map((item)=>{
            return item = {name: item.name, email: item.email, id: item.id, attendance: item.attendances}
        })
        res.json({ status:'ok', data: viewRecordsContent})
        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})


app.get('/api/leave-requests-content', async(req, res)=>{
    try{

        const users = await Users.find({name:{$ne:'admin'}});
        
        const data = await Promise.all( users.map(async (user)=>{
            const attendances = await Attendance.find({email: user.email, mark:'Pending'})
            user.attendances = []
            attendances.forEach(attendance=>{
                user.attendances.push({mark: attendance.mark, date: attendance.date});
            })
            return user;
        })
        )
        const leaveRequestsContent = data.map((item)=>{
            return item = {name: item.name, email: item.email, id: item.id, attendance: item.attendances}
        })

        const finalData = leaveRequestsContent.filter(item=>item.attendance.length>0)
        // console.log(finalData)
        res.json({status:'ok', data: finalData})
        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/confirm-mark-attendance', async(req, res)=>{
    try{
        const {email, date, mark} = req.body;
        // console.log(email, date, mark)
        await Attendance.updateOne({email: email, date: date}, {mark: mark})
        res.json({status:'ok'})

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.post('/api/create-system-report', async (req, res)=>{
    const { name, fullStartDate, fullEndDate } = req.body;
    try{
        
        const systemReports = await SystemReports.find({name: name, startDate:fullStartDate, endDate: fullEndDate})
        if(systemReports.length>0){
            return res.json(400).status({error:"Report Already Exists"});
        } else{
            const total = await Users.countDocuments({startDate:fullStartDate, endDate: fullEndDate})-1
            await SystemReports.create({
                name: name,
                startDate: fullStartDate, 
                endDate: fullEndDate,
                total,
            })
        }

        const totalAttendance = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}})

        const users = await Users.find();
        users.forEach( async (user)=>{
            const total = await Attendance.countDocuments({email: user.email, date:{$gte:fullStartDate, $lte: fullEndDate}});
            const present = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, email: user.email, mark: "Present"});
            const absent = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, email: user.email, mark: "Absent"});
            const leave = await Attendance.countDocuments({date:{$gte:fullStartDate, $lte: fullEndDate}, email: user.email, mark: "Leave"});
            
            if((((present+leave)/total) * 100 ) > 85 ){
                await SystemReports.updateOne({name: name, startDate: fullStartDate, endDate: fullEndDate,},{$inc:{gradeA : 1}});
            }
            else if((((present+leave)/total) * 100 ) > 80 ){
                await SystemReports.updateOne({name: name, startDate: fullStartDate, endDate: fullEndDate,},{$inc:{gradeB : 1}});
            }
            else if((((present+leave)/total) * 100 ) > 70 ){
                await SystemReports.updateOne({name: name, startDate: fullStartDate, endDate: fullEndDate,},{$inc:{gradeC : 1}});
            }
            else if((((present+leave)/total) * 100 ) > 60 ){
                await SystemReports.updateOne({name: name, startDate: fullStartDate, endDate: fullEndDate,},{$inc:{gradeD : 1}});
            }
            else if((((present+leave)/total) * 100 ) < 60 && (((present+leave)/total) * 100 )>0){
                await SystemReports.updateOne({name: name, startDate: fullStartDate, endDate: fullEndDate,},{$inc:{gradeF : 1}});
            }
        })
        
        res.json({status: 'ok'});

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err});
    }
})

app.get('/api/system-reports', async(req, res)=>{
    try{
        const {email} = req.body;
        const reports = await SystemReports.find()
        res.json({status:'ok', data: reports})
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})


app.post('/api/delete-system-report', async(req, res)=>{
    try{
        const {name, startDate, endDate} = req.body;
        // console.log(name, startDate, endDate)
        await SystemReports.deleteOne({name: name, startDate: startDate, endDate: endDate})
        res.json({status:'ok'})

        
    }
    catch(err){
        // console.log(err)
        res.status(400).json({err})
    }
})

app.listen(1337,()=>{
    console.log("Server started listening on 1337...");
})
