import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [PDFs, setPDFs] = useState({}); // To store PDF URLs

  useEffect(() => {
    async function fetchData() {
      try {
        const noteResponse = await fetch(`${API_BASE_URL}/pdfTitle`, {
          credentials: 'include',
          method: 'GET',
        });
        const noteResponseJson = await noteResponse.json();
        setNotes(noteResponseJson);

        // Fetch PDF for each note
        const pdfPromises = noteResponseJson.map(note => {
          if (note.file) {
            return fetchPDF(note.file);
          }
          return Promise.resolve(); // Return resolved promise for notes without files
        });

        // Wait for all PDF files to be fetched
        await Promise.all(pdfPromises);

      } catch (error) {
        console.error('Error fetching note titles or PDFs:', error);
      }
    }

    // Fetch PDF function
    async function fetchPDF(fileId) {
      try {
        const response = await fetch(`${API_BASE_URL}/pdf/${fileId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('PDF fetch failed');
        }
        const blob = await response.blob(); // Convert response to Blob
        const pdfUrl = URL.createObjectURL(blob); // Create an object URL for the Blob
        setPDFs(prevPDFs => ({ ...prevPDFs, [fileId]: pdfUrl }));
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    }

    fetchData(); // Call the function to start fetching data

  }, []); // Empty dependency array to run only once

  return (
    <div>
      <Header />
      <div className='row-container'>
        {notes.length > 0 && notes.map((note, index) => (
          // Assuming Card component accepts these props
          <Card key={note._id} {...note} pdfUrl={PDFs[note.file]} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default NotesPage;
