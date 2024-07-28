import React from 'react';

function Timeline() {
  const experiences = [
    {
      date: '2024',
      role: 'Software Engineering Fellow',
      company: 'Headstarter',
      description: 'Worked on various projects involving full-stack development and machine learning.',
    },
    
  ];

  return (
    <div className='timeline-container'>
       <div className="timeline">
            {experiences.map((experience, index) => (
                <div key={index} className="timeline-item">
                <div className="timeline-date">{experience.date}</div>
                <div className="timeline-content">
                    <h3>{experience.role}</h3>
                    <h4>{experience.company}</h4>
                    <p>{experience.description}</p>
                </div>
                </div>
            ))}
        </div> 
    </div>
    
  );
}

export default Timeline;