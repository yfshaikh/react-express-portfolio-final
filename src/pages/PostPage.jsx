import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import API_BASE_URL from '../api';

function PostPage() {
  const { id } = useParams() // extract the 'id' parameter from the URL
  const [post, setPost] = useState(null)
  const [edit, setEdit] = useState(false)
  const[redirect, setRedirect] = useState(false)
  const [image, setImage] = useState({});

  // check for authorized user to edit
  async function checkEdit() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      credentials: 'include',
    })
    if (response.ok) {
      setEdit(true)
    } 
  }

  // delete
  async function handleDelete(e) {
   if(confirm("Are you sure you want to delete this post?")){
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/post/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true)
      } else {
        const data = await response.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }
  }

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`${API_BASE_URL}/post/${id}`, {
        method: "GET",
        credentials: "include"
      })
      const data = await response.json()
      setPost(data)

      // Fetch image data if the post has a fileId
      if (data.file) {
        fetchImage(data.file);
      }
    }


    // Fetch image data
    function fetchImage(fileId) {
      fetch(`${API_BASE_URL}/file/${fileId}`, {
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Image fetch failed');
          }
          return response.blob(); // Convert response to Blob
        })
        .then(blob => {
          const imageUrl = URL.createObjectURL(blob); // Create an object URL for the Blob
          setImage(imageUrl)
        })
        .catch(error => console.error('Error fetching image:', error));
    }

    fetchPost()


 
  }, [id])

  if (!post) return <div>Loading...</div>
  if(redirect){
    return <Navigate to={'/'} />
  }


  checkEdit()
  return (
    <>
        <Header />
        <div className='post'>
            <div className='post-container'><h1 id="title">{post.title}</h1></div>
            {edit && (
                <div className='post-container'>
                  <div className='buttons'>
                    <Link className='edit-btn' to={`/edit/${id}`}>
                        Edit
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg> 
                    </Link>
                    <Link className='edit-btn' id='delete' onClick={handleDelete}>
                        Delete
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                    </Link>
                    </div>
                </div>
            )}
            <div className='post-container'><img src={{image}} alt={post.title} /></div>
            <div className='post-container' id='post-body'><div dangerouslySetInnerHTML={{ __html: post.content }} /></div>
        </div>
        <Footer />
    </>

  );
}

export default PostPage;