import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const navigate = useNavigate();
  return (
    <div className='p-5 rounded'>
      
      <div className="container rounded shadow-lg ps-5 pb-5 pt-5">
        <h3 className='text-center border mb-4 p-2'>The Attendance Management System offers following services:</h3>
        <div className="row justify-content-center">
          <div className="col-lg-3 col-sm-12 col-md-6 m-3">
              <Card style={{ width: '16rem' }}>
                <Card.Img variant="top" src="https://media.istockphoto.com/id/1059233806/vector/man-hold-attendance-clipboard-with-checklist-questionnaire-survey-clipboard-task-list-flat.jpg?s=612x612&w=0&k=20&c=Yv3g79R_g5mMliBx4McY2Xt0k552tVZ0xHbIBO2cMx8=" style={{width:"100%", height:"250px"}} />
                <Card.Body>
                  <Card.Title>View all attendances</Card.Title>
                  <Button variant="primary" className='w-100' onClick={()=>navigate("view-attendance")}>Go</Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-lg-3 col-sm-12 col-md-6 m-3">
              <Card style={{ width: '16rem' }}>
                <Card.Img variant="top" src="https://universe.byu.edu/wp-content/uploads/2020/08/Screen-Shot-2020-08-07-at-2.57.24-PM-1024x814.jpg" style={{width:"100%", height:"250px"}}/>
                <Card.Body>
                  <Card.Title>Mark your attendance</Card.Title>
                  <Button variant="primary" className='w-100' onClick={()=>navigate("mark-attendance")}>Go</Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-lg-3 col-sm-12 col-md-6 m-3">
              <Card style={{ width: '16rem' }}>
                <Card.Img variant="top" src="https://media.istockphoto.com/id/528495663/photo/leave-of-absence-request-form-on-a-desk-with-paperwork.jpg?s=612x612&w=0&k=20&c=SO-YDZ-m_G7M9rZvMs2JlqlsEHTBYffXDMNWGXcA97A=" style={{width:"100%", height:"250px"}} />
                <Card.Body>
                  <Card.Title>Mark your leave request</Card.Title>
                  <Button variant="primary" className='w-100' onClick={()=>navigate("mark-leave")}>Go</Button>
                </Card.Body>
              </Card>
            </div>
        </div>
      </div>
      

    </div>
  )
}
