import React from 'react'
import '../index.css'
import Header from '../components/Header'


function ResumePage() {
  return (
    <>
        <Header />
        <div className='pdf-container'>
          <iframe src='/Resume.pdf' title='Resume' className='pdf-doc'></iframe>
        </div>
    </>
    
  )
}

export default ResumePage
