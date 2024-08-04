import './index.css'
import './styles/AboutMe.css'
import './styles/Card.css'
import './styles/Timeline.css'
import ResumePage from './pages/ResumePage.jsx'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CreatePost from './pages/CreatePost.jsx'
import { UserContextProvider } from './UserContext.jsx'
import { useState } from 'react'
import PostPage from './pages/PostPage.jsx'
import EditPost from './pages/EditPost.jsx'
import CreateTimeline from './pages/CreateTimeline.jsx'

function App() {


  return (
    <Router>
      <UserContextProvider>
            <div className="app">
              <Routes>
                <Route path = '/' element={<HomePage />} />
                <Route path = '/resume' element={<ResumePage />} />   
                <Route path = '/login' element={<LoginPage />} /> 
                <Route path = '/create' element={<CreatePost />} />  
                <Route path="/post/:id" element={<PostPage />} /> 
                <Route path="/edit/:id" element={<EditPost />} /> 
                <Route path="/createTimeline" element={<CreateTimeline />} /> 
              </Routes>
            </div>
      </UserContextProvider>
    </Router>
      
    
  );
}

export default App;
