import React, { useState } from 'react';
import API_BASE_URL from '../api';
import '../index.css'

const UploadForm = () => {
  const [file, setFile] = useState('')
  const [title, setTitle] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const data = new FormData()
    data.set('title', title)
    data.set('file', formData)

    try {
      const response = await fetch(`${API_BASE_URL}/uploadPdf`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('File uploaded successfully');
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit}>
        <input type='text' 
                   placeholder='pdf title' 
                   value={title} 
                   onChange={(e) => setTitle(e.target.value)}/>
        <input type="file" onChange={handleFileChange} accept="application/pdf" />
        <button type="submit">Upload PDF</button>
      </form>
    </div>
  );
};

export default UploadForm;
