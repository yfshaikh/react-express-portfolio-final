import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DisplayPDF from '../components/DisplayPDF'
import API_BASE_URL from '../api'
import { useParams } from 'react-router-dom'


function DisplayNote() {
  const { id } = useParams() // extract the 'id' parameter from the URL
  const [title, setTitle] = useState('')
  const [pdf, setPdf] = useState(null)

  useEffect(() => {
    async function fetchNote() {
      const response = await fetch(`${API_BASE_URL}/pdfTitle/${id}`, {
        method: "GET",
        credentials: "include"
      })
      // pdfTitle api returns title, file, and image id
      const data = await response.json()
      setTitle(data.title)

      // fetch associated pdf file
      fetchPdf(data.file)
    }


    // Fetch image data
    function fetchPdf(fileId) {
      fetch(`${API_BASE_URL}/pdf/${fileId}`, {
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('PDF fetch failed');
          }
          return response.blob(); // Convert response to Blob
        })
        .then(blob => {
          const pdfUrl = URL.createObjectURL(blob); // Create an object URL for the Blob
          setPdf(pdfUrl)
        })
        .catch(error => console.error('Error fetching PDF:', error));
    }

    fetchNote()


 
  }, [id])
  return (
    <>
        <Header />
        <DisplayPDF source={pdf} title={title}/>
        <Footer />
    </>
  )
}


export default DisplayNote
