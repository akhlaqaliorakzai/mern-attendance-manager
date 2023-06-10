import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
export default function PageNotFound() {
  return (
    <div className='m-5 p-5'>
        <h1 className='m-5 p-5 bg-white shadow-lg rounded-pill text-primary'><FontAwesomeIcon icon={faBan} className='me-1' /> 404 Page not found! 🙄</h1>
    </div>
  )
}
