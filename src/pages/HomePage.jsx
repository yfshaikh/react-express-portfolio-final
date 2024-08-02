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
  const [posts, setPosts] = useState([])
  const [images, setImages] = useState({}) // To store image URLs
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingImages, setLoadingImages] = useState(true)

  useEffect(() => {
    // Fetch posts
    fetch(`${API_BASE_URL}/post`, {
      credentials: 'include',
      method: 'GET',
    })
      .then(response => response.json())
      .then(posts => {
        setPosts(posts);
        setLoadingPosts(false);

        // Fetch images for each post
        const imagePromises = posts.map(post => {
          if (post.file) {
            return fetchImage(post.file);
          }
          return Promise.resolve();
        });

        // Set loadingImages to false once all images are fetched
        Promise.all(imagePromises).then(() => setLoadingImages(false));
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoadingPosts(false);
        setLoadingImages(false);
      });

    // Fetch image data
    function fetchImage(fileId) {
      return fetch(`${API_BASE_URL}/file/${fileId}`, {
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
          setImages(prevImages => ({ ...prevImages, [fileId]: imageUrl }));
        })
        .catch(error => console.error('Error fetching image:', error));
    }
  }, []);

  if (loadingPosts || loadingImages) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="row-container"><Intro title="👋 Hey! I'm Yusuf" /></div>
      <div className="row-container"><AboutMe /></div>
      <h2 className='section-heading subtitle'>Projects</h2>
      <div className='row-container'>
        {posts.length > 0 && posts.map((post, index) => (
          //pass all the props of a post to the Card component
          <Card key={post._id} {...post} image={images[post.file]} />
        ))}
      </div>
      <h2 className='section-heading subtitle'>Experience</h2>
      <div className='row-container'><Timeline /></div>
      <Footer />
    </div>
  );
}

export default HomePage;
