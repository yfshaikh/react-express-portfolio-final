import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Editor from '../components/Editor'



function CreatePost() {
  const [title, setTitle] = useState('')
  const[content, setContent] = useState('')
  const[files, setFiles] = useState('')
  const[redirect, setRedirect] = useState(false)

  async function createNewPost(event) {
    const data = new FormData()
    data.set('title', title)
    data.set('content', content)
    data.set('file', files[0])
    event.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: "POST",
      body: data,
      credentials: 'include',
    })
    if (response.ok) {
      setRedirect(true)
    } else {
      alert("Must be admin to make posts!")
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <>
      <Header />
      <div className='create-container'>
        <form onSubmit={createNewPost}>
          <input type='title' 
                placeholder='title' 
                onChange={(event) => setTitle(event.target.value)} />
          <input type='file' 
                onChange={(event) => setFiles(event.target.files)} 
                id='file'/>
          <Editor onChange={setContent} value={content}/>
          <button style={{marginTop: '5px'}}>Create post</button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default CreatePost
