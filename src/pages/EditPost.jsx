import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Editor from '../components/Editor'
import {useEffect, useState} from "react";
import { Navigate, useParams} from "react-router-dom";
import API_BASE_URL from '../api';


function EditPost() {
  const [title, setTitle] = useState('')
  const[content, setContent] = useState('')
  const[files, setFiles] = useState('')
  const[redirect, setRedirect] = useState(false)

  const { id } = useParams() // extract the 'id' parameter from the URL

  useEffect(() => {
    fetch(`${API_BASE_URL}/post/${id}`, {
      credentials: 'include',
    })
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title)
          setContent(postInfo.content) 
          setFiles(postInfo.file)
        })
      })
  }, [])

  async function updatePost(event) {
    event.preventDefault()
    const data = new FormData()
    data.set('title', title)
    data.set('content', content)
    data.set('id', id)
    if (files?.[0]){
      data.set('file', files?.[0])
    }
    const test = await fetch (`${API_BASE_URL}/post`, {
      method: "PUT",
      body: data,
      credentials: 'include'
    })
    if(test.ok){
      setRedirect(true)
    }

  }
  if(redirect){
    return <Navigate to={`/post/${id}`} />
  }

  return (
    <>
      <Header />
      <div class='create-container'>
        <form onSubmit={updatePost}>
          <input type='title' 
                placeholder='title' 
                onChange={(event) => setTitle(event.target.value)} />
          <input type='file' 
                onChange={(event) => setFiles(event.target.files)} 
                id='file'/>
          <Editor onChange={setContent} value={content}/>
          <button style={{marginTop: '5px'}}>Update post</button>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default EditPost
