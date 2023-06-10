import React, { useState } from 'react'
import { Alert, Button, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jwtDecode from 'jwt-decode';

export default function MarkAttendance() {
  const user = localStorage.getItem('token');
  const name = user && jwtDecode(user).name;
  const email = user && jwtDecode(user).email; 
  const id = user && jwtDecode(user).id; 

  const[date, setDate] = useState(new Date());

  const[mark, setMark] = useState("Present");
  
  const [isMarked, setIsMarked] = useState();
  const [showAlert,setShowAlert] = useState()

  async function markAttendance(){

    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    const fullDate = `${month<10 ? '0'+month : month}/${day<10? '0'+day : day}/${year}`
    
    const res = await fetch('http://localhost:1337/api/mark-attendance',{
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "x-access-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({email, date:fullDate, mark})
    })
    const data = await res.json();
    if(data.status=='ok'){
      setIsMarked(true)
      setShowAlert(true)
    }
    else{
      setIsMarked(false)
      setShowAlert(true)
    }
  }
  return (
    <div className='m-5 shadow-lg rounded p-5'>
    <h3 className='text-center mb-3 border p-2 text-success'>Mark Your Attendance</h3>
      <div className='table-responsive shadow-lg p-4 rounded'>
        <Table striped bordered hover className='text-center'>
          <thead>
            <tr className='align-middle'>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Mark</th>
            </tr>
          </thead>
          <tbody>
            <tr className='align-middle'>
              <td>{id}</td>
              <td>{name}</td>
              <td>{email}</td>
              <td><ReactDatePicker selected={date} onChange={(date)=>setDate(date)}/></td>
              <td>
                <select className='rounded p-1 border border-secondary' onChange={(e)=>setMark(e.target.value)}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </td>
            </tr>
          </tbody>
        </Table>
        {
            isMarked ? 
            
            <div className='text-white'>
                {showAlert && <Alert variant='success' onClose={()=>setShowAlert(false)} dismissible>Attendance Successfully Marked!</Alert>}
            </div>
            :
              <div className='text-white'>
                  { showAlert && <Alert variant='danger' onClose={()=>setShowAlert(false)} dismissible>You have already marked yourself for this date!!</Alert>}
              </div>
          }
        <div className='text-center'>
          <Button variant='outline-success' className='fs-5' onClick={markAttendance}>Submit Attendance</Button>
        </div>
      </div>
    </div>
  )
}
