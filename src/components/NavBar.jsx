import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'; 
import { Link, NavLink, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faCheck, faDisease, faEye, faSignIn, faRegistered, faDashboard, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import { Dropdown } from 'react-bootstrap';

export default function NavBar({user, isAdmin}) {
  
  const navigate = useNavigate();
  const userName = user && jwtDecode(user).name;
  const firstName = userName && userName.split(" ")[0];

  return (
    <Navbar bg="dark" expand="lg">
      <Container fluid>
        <div className='ms-4' style={{width:"15%", height:"25%"}}>
            <Link to={isAdmin?'dashboard':'/'} href="#"><img src='https://images.businessnewsdaily.com/app/uploads/2022/08/01033149/Clockify_logo.png' alt='logo'  className='rounded' style={{width:"25%"}} /></Link>
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" className='bg-white p-1' />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            
            {user && !isAdmin && <NavLink to="/" className='text-white bg-primary p-3 me-1 fs-5 nav-link-hover text-decoration-none m-1'><FontAwesomeIcon icon={faSchool} className='me-1' />Home</NavLink>}
            {user && !isAdmin && <NavLink to="view-attendance" className='text-white bg-primary p-3 me-1 fs-5 nav-link-hover text-decoration-none m-1'><FontAwesomeIcon icon={faEye} className='me-1' />View Attendance</NavLink>}
            {user && !isAdmin && <NavLink to="mark-attendance" className='text-white bg-primary p-3 me-1 fs-5 nav-link-hover text-decoration-none m-1'><FontAwesomeIcon icon={faCheck} className='me-1' />Mark Attendance</NavLink>}
            {user && !isAdmin && <NavLink to="mark-leave" className='text-white bg-primary p-3 me-1 fs-5 nav-link-hover text-decoration-none m-1'><FontAwesomeIcon icon={faDisease} className='me-1' />Mark Leave</NavLink>}
            {isAdmin && <NavLink to="dashboard" className='text-white bg-danger p-3 me-1 fs-5 nav-link-hover text-decoration-none m-1'><FontAwesomeIcon icon={faDashboard} className='me-1' />Dashboard</NavLink>}
          </Nav>
          {!user && <NavLink to="sign-in" className='text-white ms-2 me-2 p-2 bg-primary rounded btn-sign-in text-decoration-none'><FontAwesomeIcon icon={faSignIn} className='me-1' /> Sign in</NavLink>}
          {!user && <NavLink to="register" className='text-white ms-2 me-2 p-2 bg-success rounded btn-hover btn-register text-decoration-none'><FontAwesomeIcon icon={faRegistered} className='me-1' /> Register</NavLink>}
          

        {isAdmin ? 
          <NavLink className='text-white ms-2 me-2 p-2 bg-danger rounded btn-hover btn-log-out text-decoration-none me-5' onClick={()=>{localStorage.clear();window.location.href='/'}}><FontAwesomeIcon icon={faSignOut} className='me-1' /> Logout</NavLink>
          : userName &&
          <Dropdown>
            <Dropdown.Toggle variant="success" className='border border-primary border-2 text-info fs-5 bg-dark me-4'>
              {firstName && firstName} <FontAwesomeIcon icon={faUser} className='me-1' />
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item>
                <NavLink to='profile' className='text-white text-decoration-none'><FontAwesomeIcon icon={faUser} className='me-1' /> Account</NavLink>
              </Dropdown.Item>
              <Dropdown.Item className='bg-danger btn-hover btn-log-out'>
                <NavLink className='text-white text-decoration-none' onClick={()=>{localStorage.clear();window.location.href='/'}}><FontAwesomeIcon icon={faSignOut} className='me-1' /> Logout</NavLink>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        }
          
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
