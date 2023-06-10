import React from 'react'
import { Alert, Button, Nav, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faWarning, faUsers, faClose, faDashboard, faTasks, faList, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import ViewRecords from './ViewRecords';
import LeaveRequests from './LeaveRequests';
import SystemReports from './SystemReports';
import PageNotFound from '../PageNotFound';
import jwtDecode from 'jwt-decode';

export default function Dashboard() {
  const user = localStorage.getItem('token')
  const isAdmin = user && jwtDecode(user).name=='admin';

  const isSignedIn = !!user;
  return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-lg-2 bg-white shadow-lg fs-6 m-3 p-3 border rounded">
                <Nav className='flex-column'>
                    <Link to='../dashboard' className='border bg-primary text-white rounded text-decoration-none ps-3 pe-3 p-2 fs-5'><FontAwesomeIcon icon={faDashboard} className='me-2' />Dashboard</Link>
                    <Link to="../dashboard/view-records" className='border bg-primary text-white rounded text-decoration-none ps-2 pe-2 p-2 fs-5'><FontAwesomeIcon icon={faTasks} className='me-2' />Attend. Records</Link>
                    <Link to='../dashboard/leave-requests' className='border bg-primary text-white rounded text-decoration-none p-2 fs-5'><FontAwesomeIcon icon={faWarning} className='me-2' />Leaves Requests</Link>
                    <Link to='../dashboard/system-reports' className='border bg-primary text-white rounded text-decoration-none ps-2 pe-2 p-2 fs-5'><FontAwesomeIcon icon={faList} className='me-2' />System Reports</Link>
                </Nav>
            </div>
            <Routes>
                {isSignedIn ? <Route path='view-records' element={<ViewRecords/>}/>: <Navigate to="../sign-in" replace/>}
                {isSignedIn ? <Route path='leave-requests' element={<LeaveRequests/> }/>: <Navigate to="../sign-in" replace/>}
                {isSignedIn ? <Route path='system-reports' element={<SystemReports/>}/>: <Navigate to="../sign-in" replace/>}
                {isSignedIn ? <Route path='/' exact element={<DashboardContent/>}/>: <Navigate to="../sign-in" replace/>}
           </Routes>

        </div>
    </div>
   
  )
}
