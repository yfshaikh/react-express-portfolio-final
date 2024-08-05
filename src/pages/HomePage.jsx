import Card from '../components/Card.jsx';
import Intro from '../components/Intro.jsx';
import Header from '../components/Header.jsx';
import AboutMe from '../components/AboutMe.jsx';
import Timeline from '../components/Timeline.jsx';
import Footer from '../components/Footer.jsx';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../api.jsx';
import '../index.css'
import '../styles/Timeline.css'

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState({}); // To store image URLs
  const [loading, setLoading] = useState(true); // Unified loading state
  const [timeline, setTimeline] = useState([]); //timeline of experience

  useEffect(() => {
    async function fetchData() {
      try {
        const postResponse = await fetch(`${API_BASE_URL}/post`, {
          credentials: 'include',
          method: 'GET',
        });
        const posts = await postResponse.json();
        setPosts(posts);

        // Fetch images for each post
        const imagePromises = posts.map(post => {
          if (post.file) {
            return fetchImage(post.file);
          }
          return Promise.resolve();
        });

        // Wait for all images to be fetched
        await Promise.all(imagePromises);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts or images:', error);
        setLoading(false);
      }
    }

    async function fetchTimelineData() {
      try {
        const timelineResponse = await fetch(`${API_BASE_URL}/timeline`, {
          credentials: 'include',
          method: 'GET',
        });
        const timelines = await timelineResponse.json();
        setTimeline(timelines)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timeline:', error);
        setLoading(false);
      }
    }

    fetchData()
    fetchTimelineData()
  }, []); 

  // Fetch image data
  async function fetchImage(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/file/${fileId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Image fetch failed');
      }
      const blob = await response.blob(); // Convert response to Blob
      const imageUrl = URL.createObjectURL(blob); // Create an object URL for the Blob
      setImages(prevImages => ({ ...prevImages, [fileId]: imageUrl }));
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  if (loading) {
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
          // Pass all the props of a post to the Card component
          <Card key={post._id} {...post} image={images[post.file]} />
        ))}
      </div>
      <h2 className='section-heading subtitle'>Experience</h2>
      <div className='row-container'>
        <div className='timeline'>
          {timeline.length > 0 && timeline.map((experience) => (
            // Pass all the props of a timeline to the Timeline component
            <Timeline key={experience._id} {...experience} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
