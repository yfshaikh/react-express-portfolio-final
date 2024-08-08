import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import '../index.css';
import API_BASE_URL from '../api';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [PDFs, setPDFs] = useState({});
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true); // Unified loading state

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // fetch pdf titles and associated file IDs (the pdf schema includes title, file, and image id)
        const noteResponse = await fetch(`${API_BASE_URL}/pdfTitle`, {
          credentials: 'include', 
          method: 'GET',
        });
        // convert response to JSON
        const noteResponseJson = await noteResponse.json();
        // store notes data in state
        setNotes(noteResponseJson);

        // for each note, fetch the associated pdf and image id
        const fetchPromises = noteResponseJson.map(note => {
          // fetch the PDF (param: the file id associated with a pdf)
          const pdfFetch = note.file ? fetchPDF(note.file) : Promise.resolve();
          // fetch the image (param: the image object id associated with a pdf)
          const imageFetch = note.image ? fetchImage(note.image) : Promise.resolve();
          // return a promise that resolves when both fetches are complete
          return Promise.all([pdfFetch, imageFetch]);
        });

        // wait for all fetch operations to complete
        await Promise.all(fetchPromises);

        // Set loading to false after all fetches are complete
        setLoading(false);
      } catch (error) {
        console.error('Error fetching note titles, PDFs, or images:', error);
        setLoading(false); // Ensure loading state is set to false even on error
      }
    }

    // fetch a pdf by id
    async function fetchPDF(fileId) {
      try {
        // fetch the pdf file
        const response = await fetch(`${API_BASE_URL}/pdf/${fileId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('PDF fetch failed');
        }

        // convert response to Blob (binary data)
        const blob = await response.blob();
        // create an object URL for the Blob
        const pdfUrl = URL.createObjectURL(blob);
        // store the pdf url in state
        setPDFs(prevPDFs => ({ ...prevPDFs, [fileId]: pdfUrl }));
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    }

    // fetch an image by ID
    async function fetchImage(imageId) {
      console.log(`Fetching image from URL: ${API_BASE_URL}/image/${imageId}`);
      try {
        // fetch image (param: the id of the image object)
        // api will go to the image object, get the associated file id, and fetch the file
        const response = await fetch(`${API_BASE_URL}/image/${imageId}`, {
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error('Image fetch failed');
        }
        // convert response to Blob (binary data)
        const blob = await response.blob();
        // create an object url for the Blob
        const imageUrl = URL.createObjectURL(blob);
        // store the image url in state
        setImages(prevImages => ({ ...prevImages, [imageId]: imageUrl }));
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }

    fetchData();

  }, []);

  if (loading) return <div className='loading'>Loading...</div>; // Show loading indicator until all data is fetched

  return (
    <div>
      <Header />
      <div className='pdf-container'>
        <h2 style={{fontWeight: '400'}}>These are my notes, I publish notes from college classes, online courses, and anything else I'm interested in!</h2>
      </div>
      <div className='row-container' style={{paddingBottom: '20em'}}>
        {notes.length > 0 && notes.map((note, index) => (
          <Card key={note._id} {...note} pdfUrl={PDFs[note.file]} image={images[note.image]} type={'pdf'}/>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default NotesPage;
