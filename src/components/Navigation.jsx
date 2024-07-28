import React from 'react'
import { Link } from 'react-router-dom'


function Navigation() {
  return (
    <div>
        <nav>
            <ul>
            <li><Link to='/' className='nav-btn'>Home</Link></li>
            <li><Link to='/resume' className='nav-btn'>Resume</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default Navigation
