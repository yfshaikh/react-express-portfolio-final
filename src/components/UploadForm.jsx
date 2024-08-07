import React, { useState } from 'react';
import API_BASE_URL from '../api';
import '../index.css';
import { Link, Navigate } from 'react-router-dom';

const UploadForm = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageId, setImageId] = useState(null);
  const[redirect, setRedirect] = useState(false)

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    setPdfFile(selectedFile);
    setPdfUploaded(true);
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    setImageFile(selectedFile);

    const imageFormData = new FormData();
    imageFormData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/uploadImage`, {
        method: 'POST',
        body: imageFormData,
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setImageId(result._id); // Store the image ID
        setImageUploaded(true);
        setRedirect(true)
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile || !imageFile) {
      alert('Please select both a PDF and an image to upload.');
      return;
    }

    const pdfFormData = new FormData();
    pdfFormData.append('file', pdfFile);
    pdfFormData.append('title', title);
    pdfFormData.append('imageId', imageId); // Include the image ID

    try {
      const response = await fetch(`${API_BASE_URL}/uploadPdf`, {
        method: 'POST',
        body: pdfFormData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('Files uploaded successfully');
      } else {
        alert('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    }
  };

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit}>
        <input 
          type='text' 
          placeholder='PDF title' 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />

        {!pdfUploaded && (
          <label htmlFor="pdfInput" className="file-upload">
            Upload PDF
          </label>
        )}
        <input 
          type="file"
          id="pdfInput"
          onChange={handlePdfChange}
          accept="application/pdf"
          style={{ display: pdfUploaded ? 'block' : 'none' }}
        />

        {!imageUploaded && (
          <label htmlFor="imageInput" className="file-upload">
            Upload Image
          </label>
        )}
        <input 
          type="file"
          id="imageInput"
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: imageUploaded ? 'block' : 'none' }}
        />

        {pdfUploaded && imageUploaded && (
          <button type="submit">Upload</button>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
