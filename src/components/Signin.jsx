import React, { useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode';

export default function Signin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [isUserExist, setIsUserExist] = useState(true);
  const [isUserExistText, setIsUserExistText] = useState();
  

  const navigate = useNavigate();

  async function signIn(e){
    e.preventDefault();
    const res = await fetch("http://localhost:1337/api/sign-in",{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email, password}),
    })
    const data = await res.json();
    if(data.status=="ok"){
      localStorage.setItem('token',data.user)
      
      window.location.href='/'
    }
    else{
      setIsUserExistText("User not exists!")
    }
  }
  return (
    <div className='mb-5 d-flex justify-content-center'>
        <Form className='shadow-lg p-5 rounded mt-5' onSubmit={signIn}>
          <h2 className='text-primary p-2'>Sign in</h2>
          <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required onChange={(e)=>setEmail(e.target.value)}/>
              <Form.Text className="text-muted">
              We'll never share your email with anyone else.
              </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required onChange={(e)=>setPassword(e.target.value)}/>
          </Form.Group>
          {
            isUserExistText && 
            <div>
                    <Alert variant='danger' onClose={()=>setIsUserExist(false)} dismissible>User not exits!</Alert>
                    {!isUserExist && (() => { setIsUserExistText(); setIsUserExist(true)})()}
            </div>
          }
          <Button variant="primary" type="submit" className='mt-3'>
              Sign in
          </Button>
          <p className='pt-3 pb-3'>Not Registered <span><Link to='../register'>Register</Link></span></p>
        </Form>
    </div>
  )
}
