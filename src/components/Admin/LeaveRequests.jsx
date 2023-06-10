import React, { useEffect, useState } from 'react'
import { Alert, Button, Table } from 'react-bootstrap'

export default function LeaveRequests() {
    const[pageData, setPageData] = useState();


    async function confirmMark(email, date, mark){
        const res = await fetch('http://localhost:1337/api/confirm-mark-attendance',{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, date, mark}),
        })
        const data = await res.json();
        if(data.status=='ok'){
            populatePage();
        }
        else{
            alert("failed to update mark attendance status")
        }
    }
    async function populatePage(){
        const res = await fetch('http://localhost:1337/api/leave-requests-content');
        const data = await res.json();
        if(data.status=='ok'){
            
            const tempData = data.data.map((user)=>(
                user.attendance.map((attend)=>(
                    <tr className='align-middle'>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{attend.date}</td>
                        <td><Button variant='outline-success' onClick={()=>{confirmMark(user.email, attend.date, 'Leave')}}>Approve</Button></td>
                        <td><Button variant='outline-danger' onClick={()=>{confirmMark(user.email, attend.date, 'Absent')}}>Reject</Button></td>
                    </tr>
                ))  
            ))
            setPageData(tempData)
            
        }
        else{
            alert("failed to get data")
        }
        
    }
    useEffect(()=>{
        populatePage();
    },[])

  return (
    <div className="col-lg-9 ms-3 p-4">
        <div className='table-responsive shadow-lg p-4 rounded border'>
            <h4 className='mb-3'>Students Leave Requests</h4>
                <Table hover className='text-center'>
                    <thead>
                        <tr className='align-middle'>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>For Date</th>
                        <th>Approve</th>
                        <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pageData && pageData.length>0 ?
                            pageData :
                            <tr><td colSpan='8'><Alert variant='danger' className='w-100'>No Data exists</Alert></td></tr>
                        }
                    </tbody>
                </Table>
        </div>
    </div>

  )
}
