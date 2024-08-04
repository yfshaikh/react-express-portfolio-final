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
    const data = new FormData()
    data.set('title', title)
    data.set('subtitle', subtitle)
    data.set('description', description)
    data.set('startDate', startDate)
    data.set('endDate', endDate)
    event.preventDefault()
    const response = await fetch(`${API_BASE_URL}/timeline`, {
      method: "POST",
      body: data,
      credentials: 'include',
    })
    if (response.ok) {
      setRedirect(true)
    } else {
      alert("Must be admin to make timelines!")
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <>
      <Header />
      <div className='create-container'>
        <form onSubmit={createNewTimeline}>
          <input type='title' 
                 placeholder='title' 
                 onChange={(event) => setTitle(event.target.value)} />
          <input type='subtitle' 
                 placeholder='subtitle' 
                 onChange={(event) => setSubtitle(event.target.value)} />
          <input type='startDate' 
                 placeholder='start date' 
                 onChange={(event) => setStartDate(event.target.value)} />
          <input type='endDate' 
                 placeholder='end date' 
                 onChange={(event) => setEndDate(event.target.value)} />            
          <Editor onChange={setDescription} value={description}/>
          <button style={{marginTop: '5px'}}>Create timeline</button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default CreateTimeline