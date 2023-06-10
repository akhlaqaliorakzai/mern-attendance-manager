import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import ReactDatePicker from 'react-datepicker';

export default function SystemReports() {
    //createReportModal
    const [showCreateReportModal, setShowCreateReportModal] = useState(false);
    const handleCreateReportModalClose = () => setShowCreateReportModal(false);
    const handleCreateReportModalShow = () => setShowCreateReportModal(true);

    //create report
    const[name, setName] = useState('');
    const[startDate, setStartDate] = useState(new Date());
    const[endDate, setEndDate] = useState(new Date());

    //viewReportModal
    const [showViewReportModal, setShowViewReportModal] = useState(false);
    const handleViewReportModalClose = () => setShowViewReportModal(false);
    const handleViewReportModalShow = () => setShowViewReportModal(true);

    //view report modal
    const [modalData, setModalData] = useState();

    const[reportsData, setReportsData] = useState();

    async function createReport(){
        const day = startDate.getDate();
        const month = startDate.getMonth()+1;
        const year = startDate.getFullYear();
        const fullStartDate = `${month<10 ? '0'+month : month}/${day<10? '0'+day : day}/${year}`

        const dayE = endDate.getDate();
        const monthE = endDate.getMonth()+1;
        const yearE = endDate.getFullYear();
        const fullEndDate = `${monthE<10 ? '0'+monthE : monthE}/${dayE<10? '0'+dayE : dayE}/${yearE}`

        const res = await fetch('http://localhost:1337/api/create-system-report',{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({name, fullStartDate, fullEndDate})
        })
        const data = await res.json();
        if(data.status=='ok'){
            setShowCreateReportModal(false)
            setStartDate(new Date());
            setEndDate(new Date());
            populateReports();
        }
        else{
            alert("report already exists")
        }
        
    }

    async function populateReports(){
        const res = await fetch('http://localhost:1337/api/system-reports')
        const data = await res.json();
        if(data.status=='ok'){
           const tempData = data.data.map(report=>(
                <tr className='align-middle'>
                    <td>{report.name}</td>
                    <td>{report.startDate}</td>
                    <td>{report.endDate}</td>
                    <td><Button variant='outline-primary' onClick={()=>{handleViewReportModalShow(); setModalData(report)}}>View Details</Button></td>
                    <td><Button variant='outline-danger' onClick={()=>deleteReport(report)}>Delete</Button></td>
                </tr>
            ))
            setReportsData(tempData)
        }
        else{
            setReportsData()
        }
    }

    useEffect(()=>{
        populateReports();
    },[])

    async function deleteReport(report){
        const res = await fetch('http://localhost:1337/api/delete-system-report',{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({name: report.name, startDate: report.startDate, endDate: report.endDate})
        })
        const data = await res.json();
        if(data.status=='ok'){
            populateReports();
        }
        else{
            alert("report not deleted")
        }

    }
  return (
    <div className="col-lg-9 ms-3 p-4">
        <div className='table-responsive shadow-lg p-4 rounded border'>
            <Button variant='primary' className='w-100 fs-4 mb-4' onClick={handleCreateReportModalShow}>Add System Report <FontAwesomeIcon icon={faAdd} className='me-2' /></Button>
            <h4 className='mb-3'>Complete System Reports</h4>
                <Table hover className='text-center'>
                    <thead>
                        <tr className='align-middle'>
                        <th>Report Name</th>
                        <th>From</th>
                        <th>To</th>
                        <th>View Details</th>
                        <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        { reportsData && reportsData.length>0 ? reportsData : <tr><td colSpan='5'><Alert variant='danger' className='w-100'>No Data exists</Alert></td></tr>}
                    </tbody>
                </Table>
        </div>

        {/* Create Report */}
        <Modal show={showCreateReportModal} onHide={handleCreateReportModalClose} size='lg'>
            <Modal.Header closeButton>
            <Modal.Title>Create Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="shadow-lg ms-5 me-5 m-3 p-4">
                    <div className='text-center'>
                        <h6 className='mt-3'>Enter name for the report</h6> 
                        <div className='d-flex justify-content-center'>
                            <Form.Control type='text' onChange={(e)=>setName(e.target.value)} placeholder='Enter name' className='w-50 mb-2' />
                        </div>
                        <h6>Select Start Data:</h6>
                        <ReactDatePicker selected={startDate} onChange={(date)=>setStartDate(date)}/>
                        <h6 className='mt-3'>Select End Data:</h6>
                        <ReactDatePicker selected={endDate} onChange={(date)=>setEndDate(date)}/>
                        
                    </div>
                    <div className="text-center">
                        <Button variant='primary' className='mt-3' onClick={createReport} disabled={name==''}>Create Report</Button>
                    </div>
                </div>
                
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleCreateReportModalClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>

        {/* View Report */}
        <Modal show={showViewReportModal} onHide={handleViewReportModalClose} size='xl'>
            <Modal.Header closeButton>
            <Modal.Title>Create Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table hover className='text-center'>
                    <thead>
                        <tr className='align-middle'>
                        <th>Report Name</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Total Students</th>
                        <th>Grade A Total Students</th>
                        <th>Grade B Total Students</th>
                        <th>Grade C Total Students</th>
                        <th>Grade D Total Students</th>
                        <th>Grade F Total Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            modalData ?
                            <tr>
                                <td>{modalData.name}</td>
                                <td>{modalData.startDate}</td>
                                <td>{modalData.endDate}</td>
                                <td>{modalData.total}</td>
                                <td>{modalData.gradeA}</td>
                                <td>{modalData.gradeB}</td>
                                <td>{modalData.gradeC}</td>
                                <td>{modalData.gradeD}</td>
                                <td>{modalData.gradeF}</td>
                                
                            </tr> :
                            <tr><td colSpan='9'><Alert variant='danger' className='w-100'>No Data exists</Alert></td></tr>


                        }
                        
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={handleViewReportModalClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    
    </div>
  )
}
