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
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


  useEffect(() => {
    async function fetchNote() {
      try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pdfTitle/${id}`, {
        method: "GET",
        credentials: "include"
      })
      // pdfTitle api returns title, file, and image id
      const data = await response.json()
      setTitle(data.title)

      // fetch associated pdf file
      fetchPdf(data.file)
    } catch (err) {
      console.error('Error fetching note:', err);
      setError(err.message);
      setLoading(false);
    }
    }


    // Fetch image data
    async function fetchPdf(fileId) {
      try {
        const response = await fetch(`${API_BASE_URL}/pdf/${fileId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('PDF fetch failed');
        }

        const blob = await response.blob(); // Convert response to Blob
        const pdfUrl = URL.createObjectURL(blob); // Create an object URL for the Blob
        setPdf(pdfUrl);
        setLoading(false); // Stop loading after successful fetch
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchNote()


 
  }, [id])

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (error) {
    return (
      <div>
        <p>Error loading PDF: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    ); // Show error and retry button
  }
  
  return (
    <>
        <Header />
        <DisplayPDF source={pdf} title={title}/>
        <Footer />
    </>
  )
}


export default DisplayNote
