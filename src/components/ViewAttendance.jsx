import React, { useEffect, useState } from 'react'
import { Alert, Button, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faWarning, faUsers, faClose, faClock } from '@fortawesome/free-solid-svg-icons';
import jwtDecode from 'jwt-decode';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ViewAttendance() {
  const [totalCount, setTotalCount] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalLeave, setTotalLeave] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const user = localStorage.getItem('token');
  const name = user && jwtDecode(user).name; 
  const id = user && jwtDecode(user).id; 

  const [populatePageData, setPopulatePageData] = useState();

  async function populate(){
    const res = await fetch('http://localhost:1337/api/all-attendances',{
      headers:{ 'x-access-token': localStorage.getItem('token')},
    })

    const data = await res.json();
    if(data.status='ok'){
      
      setTotalCount(data.totalCount)
      setTotalPresent(data.totalPresent)
      setTotalAbsent(data.totalAbsent)
      setTotalLeave(data.totalLeave)
      setTotalPending(data.totalPending)
      
      const sortedData = data.data.sort((prev, next)=>{
        if(prev.date>next.date){
          return 1;
        }
        else if(prev.date<next.date){
          return -1;
        }
        else{
          return 0;
        }
      })
      const tempData = sortedData.map(item=>(
        <tr className='align-middle'>
          <td>{id}</td>
          <td>{name}</td>
          <td>{item.date}</td>
          <td className='d-flex justify-content-center' >
            <Alert variant={item.mark=='Present'?'success':item.mark=='Absent'?'danger':item.mark=='Leave'?'warning':'primary'} className='w-25 p-1 pe-3 mt-1 border border-white'>{item.mark}</Alert>
          </td>
        </tr>
      ));

      setPopulatePageData(tempData)

    }
    else{
      alert('Data not exists')
    }
  }
  useEffect(()=>{
    populate();
  },[])
  return (
    <div className='m-5 mt-2 shadow-lg rounded p-5 pt-4'>
      <h3 className='text-center mb-3 border p-2 text-info'>Your Attendace History</h3>
      <div className='row d-flex justify-content-center'>
        <div className='col col-lg-2 col-md-5 col-sm-11 d-inline bg-white text-white rounded m-1 p-2 pe-4 shadow-lg text-center border'><p className='mb-1 text-dark fs-5'>Total </p> <p className='text-primary fs-3 fw-bold'><FontAwesomeIcon icon={faUsers} className='me-2' />{totalCount}</p></div>
        <div className='col col-lg-2 col-md-5 col-sm-11 d-inline bg-white text-white rounded m-1 p-2 pe-4 shadow-lg text-center border'><p className='mb-1 text-dark fs-5'>Presents </p> <p className='text-success fs-3 fw-bold'><FontAwesomeIcon icon={faCheck} className='me-2' />{totalPresent}</p></div>
        <div className='col col-lg-2 col-md-5 col-sm-11 d-inline bg-white text-white rounded m-1 p-2 pe-4 shadow-lg text-center border'><p className='mb-1 text-dark fs-5'>Absents </p> <p className='text-danger fs-3 fw-bold'><FontAwesomeIcon icon={faClose} className='me-2' />{totalAbsent}</p></div>
        <div className='col col-lg-2 col-md-5 col-sm-11 d-inline bg-white text-white rounded m-1 p-2 pe-4 shadow-lg text-center border'><p className='mb-1 text-dark fs-5'>Leaves </p> <p className='text-info fs-3 fw-bold'><FontAwesomeIcon icon={faWarning} className='me-2' />{totalLeave}</p></div>
        <div className='col col-lg-3 col-md-5 col-sm-11 col-3 d-inline bg-white text-white rounded m-1 p-2 pe-4 shadow-lg text-center border'><p className='mb-1 text-dark fs-5'>Leaves Requests Pending</p> <p className='text-warning fs-3 fw-bold'><FontAwesomeIcon icon={faClock} className='me-2' />{totalPending}</p></div>
      </div>
      <div className='table-responsive shadow-lg p-4 rounded'>
        <Table striped bordered hover className='text-center'>
          <thead>
            <tr className='align-middle'>
              <th>#</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
                populatePageData && populatePageData.length>0 ?
                populatePageData :
                <tr><td colSpan='8'><Alert variant='danger' className='w-100'>No Data exists</Alert></td></tr>
            }
          </tbody>
        </Table>
      </div>
    </div>
  )
}
