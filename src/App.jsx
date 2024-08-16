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
import NotesPage from './pages/NotesPage.jsx'
import UploadNotes from './pages/UploadNotes.jsx'
import DisplayNote from './pages/DisplayNote.jsx'
import EditTimeline from './pages/EditTimeline.jsx'
import { Analytics } from "@vercel/analytics/react"


function App() {


  return (
    <>
      <Router>
        <UserContextProvider>
              <div className="app">
                <Routes>
                  <Route path = '/' element={<HomePage />} />
                  <Route path = '/resume' element={<ResumePage />} />   
                  <Route path = '/login' element={<LoginPage />} /> 
                  <Route path = '/create' element={<CreatePost />} />  
                  <Route path="/post/:id" element={<PostPage />} /> 
                  <Route path="/pdf/:id" element={<DisplayNote />} /> 
                  <Route path="/edit/:id" element={<EditPost />} /> 
                  <Route path="/createTimeline" element={<CreateTimeline />} /> 
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/uploadNotes" element={<UploadNotes />} />
                  <Route path='/editTimeline/:id' element={<EditTimeline />} />
                </Routes>
              </div>
        </UserContextProvider>
      </Router>
      <Analytics />
    </>
    
      
    
  );
}

export default App;
