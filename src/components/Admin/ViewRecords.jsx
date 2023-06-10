import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faWarning, faUsers, faClose, faTasks, faList, faAdd, faServer } from '@fortawesome/free-solid-svg-icons';
import ReactDatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
export default function ViewRecords() {

    const [pageData, setPageData] = useState();

    //viewModal
    const [showViewModal, setShowViewModal] = useState(false);
    const handleViewModalClose = () => setShowViewModal(false);
    const handleViewModalShow = () => setShowViewModal(true);

    //viewReportModal
    const [showVeiwReportModal, setShowVeiwReportModal] = useState(false);
    const handleVeiwReportModalClose = () => setShowVeiwReportModal(false);
    const handleVeiwReportModalShow = () => setShowVeiwReportModal(true);
    
    //createReportModal
    const [showCreateReportModal, setShowCreateReportModal] = useState(false);
    const handleCreateReportModalClose = () => setShowCreateReportModal(false);
    const handleCreateReportModalShow = () => setShowCreateReportModal(true);

     //addUserRecordModal
     const [showAddUserModal, setShowAddUserModal] = useState(false);
     const handleAddUserModalClose = () => setShowAddUserModal(false);
     const handleAddUserModalShow = () => setShowAddUserModal(true);

    const [modalData, setModalData] = useState();

    const[startDate, setStartDate] = useState(new Date());
    const[endDate, setEndDate] = useState(new Date());

    const[reportsData, setReportsData] = useState();

    const[updateMark, setUpdateMark] = useState('Present');

    const navigate = useNavigate();

    const[addUserName, setAddUserName] = useState();
    const[addUserEmail, setAddUserEmail] = useState();
    const[addUserDate, setAddUserDate] = useState(new Date());
    const[addUserMark, setAddUserMark] = useState("Present");

    async function populatePage(){
        const res = await fetch('http://localhost:1337/api/view-records-content');
        const data = await res.json();
        if(data.status=='ok'){
            
            const tempData = data.data.map(user=>(
                <tr className='align-middle'>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td><Button variant='outline-primary' onClick={()=>{setModalData(user); handleViewModalShow();}}>View</Button></td>
                    <td><Button variant='outline-success' onClick={()=>{setModalData(user); handleViewModalShow();}}>Edit</Button></td>
                    <td><Button variant='outline-info' onClick={()=>{getReports(user); handleVeiwReportModalShow();}}>View Report</Button></td>
                    <td><Button variant='outline-secondary' onClick={()=>{setModalData(user); handleCreateReportModalShow();}}>Create Report</Button></td>
                    <td><Button variant='outline-danger' onClick={()=>deleteUser(user)}>Delete</Button></td>
                </tr>
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

    async function createReport(){
        const day = startDate.getDate();
        const month = startDate.getMonth()+1;
        const year = startDate.getFullYear();
        const fullStartDate = `${month<10 ? '0'+month : month}/${day<10? '0'+day : day}/${year}`

        const dayE = endDate.getDate();
        const monthE = endDate.getMonth()+1;
        const yearE = endDate.getFullYear();
        const fullEndDate = `${monthE<10 ? '0'+monthE : monthE}/${dayE<10? '0'+dayE : dayE}/${yearE}`

        const email = modalData.email;
        const res = await fetch('http://localhost:1337/api/create-report',{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({fullStartDate, fullEndDate, email})
        })
        const data = await res.json();
        if(data.status=='ok'){
            setShowCreateReportModal(false)
            setStartDate(new Date());
            setEndDate(new Date());
        }
        else{
            alert("report already exists")
        }
        
    }

    async function getReports(user){
        const email = user.email;
        const res = await fetch('http://localhost:1337/api/reports',{
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email}),
        });
        const data = await res.json();
        if(data.status=='ok'){
            // console.log(typeof(data.data))
            // alert(data.data.length)
           const tempData = data.data.map(report=>(
                <tr className='align-middle'>
                    <td>{report.email}</td>
                    <td>{report.startDate}</td>
                    <td>{report.endDate}</td>
                    <td>{report.totalAttendance}</td>
                    <td>{report.totalPresent}</td>
                    <td>{report.totalAbsent}</td>
                    <td>{report.totalLeave}</td>
                    <td>{report.totalLeavePending}</td>
                </tr>
            ))
            setReportsData(tempData)
        }
        else{
            setReportsData()
        }
    }

    async function deleteUser(user){
        const res = await fetch('http://localhost:1337/api/delete-user',{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email: user.email})
        })
        const data = await res.json();
        if(data.status=='ok'){
            populatePage();
        }
        else{
            alert("Failed to delete...")
        }
    }

    async function deleteAttendance(email, date){
        const res = await fetch('http://localhost:1337/api/delete-attendance',{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, date}),
        })
        const data = await res.json();
        if(data.status=='ok'){
            handleViewModalClose();
            populatePage();
        }
        else{
            alert("failed to delete attendance")
        }

    }
    async function updateAttendance(email, date, oldMark){
        const res = await fetch('http://localhost:1337/api/update-attendance',{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, date, oldMark, mark: updateMark}),
        })
        const data = await res.json();
        if(data.status=='ok'){
            handleViewModalClose();
            populatePage();
            setUpdateMark('Present')
        }
        else{
            alert("failed to update attendance")
        }

    }
    async function addUserAttendance(){
        const day = addUserDate.getDate();
        const month = addUserDate.getMonth()+1;
        const year = addUserDate.getFullYear();
        const fullDate = `${month<10 ? '0'+month : month}/${day<10? '0'+day : day}/${year}`;

        const res = await fetch('http://localhost:1337/api/add-user-attendance',{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email: addUserEmail, date: fullDate, mark: addUserMark}),
        })
        const data = await res.json();
        if(data.status=='ok'){
            handleAddUserModalShow();
            populatePage();
            setAddUserDate(new Date());
            setAddUserMark("Present")
        }
        else{
            alert("failed to add user attendance")
        }

    }
  return (
    <div className="col-lg-9 ms-3 p-4">
        
        <div className='table-responsive shadow-lg p-4 rounded border'>
        <Button variant='primary' className='w-100 fs-4 mb-4' onClick={handleAddUserModalShow}>Add Student Attendance Record <FontAwesomeIcon icon={faAdd} className='me-2' /></Button>
        
        <div className='table-responsive shadow-lg p-4 rounded border'>
            <h4 className='mb-3'>Students Records</h4>
                <Table hover className='text-center'>
                    <thead>
                        <tr className='align-middle'>
                        <th>#</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Edit</th>
                        <th>View Report</th>
                        <th>Create Report</th>
                        <th>Delete</th>
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
            {/* View & Edit Modal */}

            <Modal show={showViewModal} onHide={handleViewModalClose} size='xl'>
                <Modal.Header closeButton>
                <Modal.Title>View & Edit Student Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className='text-center'>
                        <thead>
                            <tr className='align-middle'>
                            <th>#</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Update</th>
                            <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            modalData && modalData.attendance.length>0 ?
                            modalData.attendance.map(attend=>(
                                <tr className='align-middle'>
                                    <td>{modalData.id}</td>
                                    <td>{modalData.name}</td>
                                    <td>{attend.date}</td>
                                    <td className='d-flex justify-content-center' >
                                        <Alert variant={attend.mark=='Present'?'success':attend.mark=='Absent'?'danger':attend.mark=='Leave'?'warning':'primary'} className='p-1 pe-3 mt-1 border border-white'>{attend.mark}</Alert>
                                    </td>
                                    <td>
                                    <select className='rounded p-1 border border-secondary' onChange={(e)=>setUpdateMark(e.target.value)}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Leave">Leave</option>
                                        </select>
                                        <Button variant='outline-success' className='ms-2' onClick={()=>updateAttendance(modalData.email, attend.date, attend.mark)}>Update</Button>
                                    </td>
                                    <td><Button variant='outline-danger' onClick={()=>deleteAttendance(modalData.email, attend.date)}>Delete</Button></td>
                                </tr>
                            )) :
                            <tr><td colSpan='4'><Alert variant='danger' className='w-100'>No Data exists</Alert></td></tr>
                        }
                        
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleViewModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            {/* view report modal */}

            <Modal show={showVeiwReportModal} onHide={handleVeiwReportModalClose} size='xl'>
                <Modal.Header closeButton>
                <Modal.Title>View Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className='text-center' >
                        <thead>
                            <tr className='align-middle'>
                            <th>Email</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Attendances</th>
                            <th>Total Present</th>
                            <th>Total Absent</th>
                            <th>Total Leave Requests</th>
                            <th>Total Leave Requests Pending</th>
                            </tr>
                        </thead>
                        <tbody>
                        {reportsData && reportsData.length>0 ? reportsData : <tr><td colSpan='8'><Alert variant='danger' className='w-100'>No Data exists</Alert></td></tr>}
                        
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleVeiwReportModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>


            {/* create report modal */}

            <Modal show={showCreateReportModal} onHide={handleCreateReportModalClose} size='lg'>
                <Modal.Header closeButton>
                <Modal.Title>Create Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="shadow-lg ms-5 me-5 m-3 p-4">
                        <div className='text-center'>
                            <h6>Select Start Data:</h6>
                            <ReactDatePicker selected={startDate} onChange={(date)=>setStartDate(date)}/>
                            <h6 className='mt-3'>Select End Data:</h6>
                            <ReactDatePicker selected={endDate} onChange={(date)=>setEndDate(date)}/> 
                        </div>
                        <div className="text-center">
                            <Button variant='primary' className='mt-3' onClick={createReport}>Create Report</Button>
                        </div>
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleCreateReportModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            {/* add user modal */}

            <Modal show={showAddUserModal} onHide={handleAddUserModalClose} size='lg'>
                <Modal.Header closeButton>
                <Modal.Title>Add Student Attendance Record</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex justify-content-center'>
                    <Form className='shadow-lg p-5 rounded w-50' onSubmit={addUserAttendance}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" required onChange={(e)=>setAddUserName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required onChange={(e)=>setAddUserEmail(e.target.value)}/>
                        </Form.Group>
                        {/* date */}
                        <p>Select Date</p>
                        <ReactDatePicker selected={addUserDate} onChange={(date)=>setAddUserDate(date)}/>
                        <p className='mt-3'>Select Status</p>
                        <select className='rounded p-1 border border-secondary' onChange={(e)=>setAddUserMark(e.target.value)}>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Leave">Leave</option>
                        </select>
                        <hr/>
                        <Button variant="primary" type="submit" className='mt-3'>Add Student</Button>
                    </Form>
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleAddUserModalClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>

  )
}
