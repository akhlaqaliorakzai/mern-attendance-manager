import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import MarkAttendance from './components/MarkAttendance';
import MarkLeave from './components/MarkLeave';
import ViewAttendance from './components/ViewAttendance';
import Signin from './components/Signin';
import Register from './components/Register';
import Dashboard from './components/Admin/Dashboard';
import ViewRecords from './components/Admin/ViewRecords';
import LeaveRequests from './components/Admin/LeaveRequests';
import SystemReports from './components/Admin/SystemReports';
import DashboardContent from './components/Admin/DashboardContent';
import jwtDecode from 'jwt-decode';
import PageNotFound from './components/PageNotFound';
import { useState } from 'react';
import Profile from './components/Profile';

function App() {
  // const [user , setUser] = useState();
  // const [isAdmin, setIsAdmin] = useState()
  const user = localStorage.getItem('token')
  const isAdmin = user && jwtDecode(user).name==='admin';
  // alert(admin)

  return (
    <Router>
      <NavBar user={user} isAdmin={isAdmin}/>
      <Routes>
        <Route path='/' element={isAdmin ? <Dashboard/> : user ? <Home/> : <Signin/>}/>
        <Route path='mark-attendance' element={user && !isAdmin ? <MarkAttendance/>: <Signin/>}/>
        <Route path='mark-leave' element={user && !isAdmin ? <MarkLeave/>: <Signin/>}/>
        <Route path='view-attendance' element={user && !isAdmin ? <ViewAttendance/>: <Signin/>}/>

        {user && <Route path='dashboard' element={isAdmin ? <Dashboard/>: <PageNotFound/>}>
          <Route path='dashboard-content' index element={<DashboardContent/>}/>
          <Route path='view-records' element={<ViewRecords/>}/>
          <Route path='leave-requests' element={<LeaveRequests/>}/>
          <Route path='system-reports' element={<SystemReports/>}/>
        </Route>}
        
         {!user && !isAdmin && <Route path='sign-in' element={<Signin/>}/>}
        {!user && !isAdmin && <Route path='register' element={<Register/>}/>}
        {user && !isAdmin && <Route path='profile' element={<Profile/>}/>}
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
