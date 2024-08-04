import React from 'react';
import '../styles/Timeline.css'

  const Timeline = ({ title, subtitle, description, startDate, endDate, _id }) => {
    return (
      <div className='timeline-container'>
        <div className="timeline">
          <div key={_id} className="timeline-item">
            <div className="timeline-date">{startDate}</div>
            <div className="timeline-content">
                <h3>{title}</h3>
                <h4>{subtitle}</h4>
                <p>{description}</p>
            </div>
          </div>
        </div> 
      </div>    
    );
  };



export default Timeline; 