import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import API_BASE_URL from '../api.jsx'

function LoginPage() {
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')
    const[redirect, setRedirect] = useState(false)

    //TODO: add comment
    async function handleLogin(e) {
        console.log(`submitted! ${username} / ${password}`)
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        })


        if(response.ok) {
            setRedirect(true)
            console.log('response ok')
        } else {
            alert("Incorrect credentials!")
            console.log('response not ok')
        }
    }

  if(redirect){
    return <Navigate to={'/'} />
  }
  return (
    <>  
        <Header />

        <div className='login-container'> 
        <form onSubmit={handleLogin}>
            <input type='text' 
                   placeholder='username' 
                   value={username} 
                   onChange={(e) => setUsername(e.target.value)}/>
            <input type='password' 
                   placeholder='password' 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)}/>
            <button>login</button>
        </form>
        </div>

        <Footer />
    </>
  )
}

export default LoginPage
