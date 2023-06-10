import jwtDecode from 'jwt-decode';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function Profile() {
    const user = localStorage.getItem('token')
    const name = user && jwtDecode(user).name;
    const email = user && jwtDecode(user).email;
    const id = user && jwtDecode(user).id;

    const[image, setImage] = useState();



    const [selectedFile, setSelectedFile] = useState();

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    async function uploadImage(){
        const data = new FormData();
        data.append('file', selectedFile);
        data.append('upload_preset', 'tklbxb34');
        data.append('cloud_name', 'dnxfqa3dx')
        const res = await fetch('https://api.cloudinary.com/v1_1/dnxfqa3dx/image/upload', {
            method: 'POST',
            body: data,
        })
        const resData = await res.json();
        const url = resData.secure_url;
        const response = await fetch('http://localhost:1337/api/upload-image',{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({url})
        })
        const imgRes = await response.json();
        if(imgRes.status=="ok"){
            getImage();
        }
        else{
            alert('failed to upload image')
        }
    }
    async function getImage(){
        const res = await fetch('http://localhost:1337/api/image',{
            headers: {'x-access-token': localStorage.getItem('token')},
        })
        const data = await res.json();
        if(data.status=="ok"){
            setImage(data.image)
            
        }
    }
    useEffect(()=>{
        getImage()
    },[])
  return (
    <div className='m-5 p-5'>
        <div className="shadow-lg p-3 mb-3">
            <div className='d-flex justify-content-center'>
                <img src={image ? image : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="} className='rounded' style={{width:"350px"}}/>
                
            </div>
            <div className="d-flex justify-content-center">
                <p className='ms-4 mt-4 mb-4 me-1 p-2 text-success rounded border'>Change Image </p> <input type="file" accept="image/*" onChange={handleFileSelect} className='m-4 p-2' required/>
                
            </div>
            <div className='text-center'>
                <Button onClick={selectedFile && uploadImage}>Upload</Button>
            </div>
        </div>
        
        <div className="text-center bg-white text-dark border shadow-lg p-4">
            <h5>Name: <span className='text-primary'>{name}</span></h5>
            <h5>Email: <span className='text-primary'>{email}</span></h5>
            <h5>ID: <span className='text-primary'>{id}</span></h5>
        </div>
        
    </div>
  )
}
