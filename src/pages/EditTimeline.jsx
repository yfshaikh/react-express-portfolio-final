import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Editor from '../components/Editor'
import {useEffect, useState} from "react";
import { Navigate, useParams} from "react-router-dom";
import API_BASE_URL from '../api';


function EditTimeline() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [redirect, setRedirect] = useState(false)
  const { id } = useParams() // extract the 'id' parameter from the URL

  useEffect(() => {
    fetch(`${API_BASE_URL}/timeline/${id}`, {
      credentials: 'include',
    })
      .then(response => {
        response.json().then(tlInfo => {
          setTitle(tlInfo.title)
          setSubtitle(tlInfo.subtitle) 
          setDescription(tlInfo.description)
          setStartDate(tlInfo.startDate)
          setEndDate(tlInfo.endDate)
        })
      })
  }, [])

  async function updateTimeline(event) {
    event.preventDefault()
    // send data to api endpoint
    const data = new FormData()
    data.set('title', title)
    data.set('subtitle', subtitle)
    data.set('description', description)
    data.set('startDate', startDate)
    data.set('endDate', endDate)
    data.set('id', id)

    const test = await fetch (`${API_BASE_URL}/timeline`, {
      method: "PUT",
      body: data,
      credentials: 'include'
    })
    if(test.ok){
      setRedirect(true)
    }

  }
  if(redirect){
    return <Navigate to={`/`} />
  }


  return (
    <>
      <Header />
      <div className='create-container'>
        <form onSubmit={updateTimeline}>
          <input
            type='text'
            placeholder='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type='text'
            placeholder='subtitle'
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
          />
          <input
            type='text'
            placeholder='start date'
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          <input
            type='text'
            placeholder='end date'
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <Editor onChange={setDescription} value={description} />
          <button style={{ marginTop: '5px' }}>Update Timeline</button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default EditTimeline
