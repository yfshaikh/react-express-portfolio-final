import Card from '../components/Card.jsx'
import Intro from '../components/Intro.jsx'
import Header from '../components/Header.jsx'
import AboutMe from '../components/AboutMe.jsx'
import Timeline from '../components/Timeline.jsx'
import Footer from '../components/Footer.jsx'
import { useEffect, useState } from 'react'
import API_BASE_URL from '../api.jsx'

function HomePage() {
  
  // dynamic posts
  const[posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/post`, {
      credentials: 'include',
    }).then(response => {
      //response from this api call will have all of the posts
      //fetch and json are async functions so we use .then()
      response.json().then(posts => {
        setPosts(posts)
      })
    })
  }, []) 

  return (
    <div>
        
        <Header />

        <div className="row-container"><Intro title="👋 Hey! I'm Yusuf"/></div>

        <div className="row-container"><AboutMe /></div>

        <h2 className='section-heading subtitle'>Projects</h2>
        <div className='row-container'>
            {posts.length > 0 && posts.map((post, index) => (
              //pass all the props of a post to the Card component
              <Card {...post}/>
            ))}
        </div>
        
        <h2 className='section-heading subtitle'>Experience</h2>
        <div className='row-container'><Timeline /></div>

        <Footer />
                            
    </div>
  )
}

export default HomePage
