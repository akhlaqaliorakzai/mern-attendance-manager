import React, { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {

    const navigate = useNavigate();
    const[name, setName] = useState();
    const[email, setEmail] = useState();
    const[id, setId] = useState();
    const[password, setPassword] = useState();
    const[retypePass, setRetypePass] = useState();

    const[duplicateAlert, setDuplicateAlert] = useState();
    const[duplicateAlertShow, setDuplicateAlertShow] = useState(true);


    async function register(e){
        e.preventDefault();
        const res = await fetch('http://localhost:1337/api/register',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({name, email, id, password}),
        })
        const data = await res.json();
        // alert(data)
        if(data.status=="ok"){
            navigate('../sign-in')
        }
        else{
            setDuplicateAlert("Failed to Register, Account with email or registeration id already exists")
        }
    }
  return (
    
    <div className='mb-5 d-flex justify-content-center'>
        <Form className='shadow-lg p-5 rounded mt-5' style={{width:"40%"}} onSubmit={register}>
            <h2 className='text-primary p-2'>Register</h2>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" required onChange={(e)=>setName(e.target.value)}/>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" required onChange={(e)=>setEmail(e.target.value)} />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Registration ID</Form.Label>
                <Form.Control type="text" placeholder="Registeration ID" required onChange={(e)=>setId(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required onChange={(e)=>setPassword(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Retype Password</Form.Label>
                <Form.Control type="password" placeholder="Retype Password" required onChange={(e)=>setRetypePass(e.target.value)}/>
            </Form.Group>
            {
                duplicateAlert && 
                <div>
                    <Alert variant='danger' onClose={()=>setDuplicateAlertShow(false)} dismissible>{duplicateAlert}</Alert>
                    {!duplicateAlertShow && (() => { setDuplicateAlert(); setDuplicateAlertShow(true)})()}
                </div>
            }
            <Button variant="primary" type="submit" className='mt-3' disabled={password!=retypePass}>
                Register
            </Button>
            { password != retypePass && <p className='text-danger'>Password & Retype password does not match</p>}
            <p className='pt-3 pb-3'>Already Registered <span><Link to='../sign-in'>Sign in</Link></span></p>
        </Form>
    </div>
  )
}
