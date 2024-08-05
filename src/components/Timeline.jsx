import React from 'react';
import '../styles/Timeline.css';

const Timeline = ({ title, subtitle, description, startDate, endDate, _id }) => {
  return (
    <>
      <div className="timeline-line"></div>
      <div className="timeline-circle"></div>
      <div className="timeline-component" key={_id}>
        <div className="timeline-content">
          <h3>{title}</h3>
          <h4>{subtitle}</h4>
          <p>{description}</p>
          <h5>{startDate} - {endDate}</h5>
        </div>
      </div>
    </>
        

  );
};

export default Timeline;

