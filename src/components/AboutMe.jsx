import React from 'react'


function AboutMe({items}) {


  return (
    <div>
        <div className="about-me-container">
            <div className="about-me-content">
                <h2 className='subtitle'>About me</h2>
                <ul>
                    <li>📖 Honors Computer Science Student @ <span className='bold'>UT Dallas</span></li>
                    <li>💻 Software Engineering Fellow @ <span className='bold'>Headstarter</span></li>
                    <li>👀 Looking for internships</li>
                    <li className='link'><a href='https://www.linkedin.com/in/yfshaikh/' className='bold'>LinkedIn</a></li>
                    <li className='link'><a href='https://github.com/yfshaikh' className='bold'>Github</a></li>
                </ul>
            </div>

            <div className="about-me-image">
                <img src='/images/pfp.jpeg' alt="Picture of Yusuf Shaikh" />
            </div>
        </div>
    </div>
  )
}

export default AboutMe
