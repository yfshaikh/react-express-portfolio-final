import React from 'react';
import '../styles/Timeline.css';

const Timeline = ({ items }) => {
  return (
    <section className="design-section">
      <div className="timeline">
        <div className="timeline-line"></div>
        {items.map((item, index) => (
          <div key={item._id} className="timeline-component">
            <div className="timeline-circle" style={{ top: `${index * 100}px` }}></div>
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <h4>{item.subtitle}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;


