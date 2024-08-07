import React from 'react'
import '../index.css'

function DisplayPDF({source, title}) {
  return (
    <>
        <div className='pdf-container'>
            <h1>{title}</h1>
        </div>
        <div className='pdf-container'>
            <iframe src={source} title={title} className='pdf-doc'></iframe>
        </div>
    </>
  )
}

export default DisplayPDF
