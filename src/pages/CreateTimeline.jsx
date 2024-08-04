import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Editor from '../components/Editor'
import '../styles/Quill.css'
import API_BASE_URL from '../api'



function CreateTimeline() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const[redirect, setRedirect] = useState(false)

  async function createNewTimeline(event) {
    event.preventDefault();
    const data = {
      title,
      subtitle,
      description,
      startDate,
      endDate,
    };

    const response = await fetch(`${API_BASE_URL}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      alert('Must be admin to make timelines!');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <>
      <Header />
      <div className='create-container'>
        <form onSubmit={createNewTimeline}>
          <input
            type='text'
            placeholder='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <input
            type='text'
            placeholder='subtitle'
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
          />
          <input
            type='date'
            placeholder='start date'
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
          />
          <input
            type='date'
            placeholder='end date'
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <Editor onChange={setDescription} value={description} />
          <button style={{ marginTop: '5px' }}>Create Timeline</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CreateTimeline;