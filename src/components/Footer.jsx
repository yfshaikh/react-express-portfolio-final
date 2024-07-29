import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import UserContext from '../UserContext.jsx'

function Footer() {
  // get context for user info
  const {userInfo, setUserInfo} = useContext(UserContext)

  useEffect(() => {
    fetch('https://react-express-portfolio-final-backend.onrender.com/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setUserInfo(userInfo)
      })
    }).catch(error => {
      console.error('There was a problem with the fetch operation:', error)
    })
  }, [])

  function handleLogout() {
    fetch('https://react-express-portfolio-final-backend.onrender.com/logout', {
      credentials: 'include',
      method: "POST",
    })

    setUserInfo(null)
  }

  // get username from userInfo
  const username = userInfo?.username
  return (
       <footer>
            <nav>
               {username ? 
                (<ul><li><Link to='/create'>Create Post</Link></li> <li><a onClick={handleLogout}>Logout</a></li></ul>) : 
                (<ul><li><Link to='/login'>Login</Link></li></ul>)
               } 
            </nav> 
        </footer>     

  )
}

export default Footer
