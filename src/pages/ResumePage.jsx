import React from 'react'
import '../index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DisplayPDF from '../components/DisplayPDF'


function ResumePage() {
  return (
    <>
        <Header />
        <DisplayPDF source={'/Resume.pdf'} title={'Resume'} />
        <Footer />
    </>
    
  )
}

export default ResumePage
