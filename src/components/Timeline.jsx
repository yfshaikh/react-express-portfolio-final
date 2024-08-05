import React from 'react';
import '../styles/Timeline.css'

  const Timeline = ({ title, subtitle, description, startDate, endDate, _id }) => {
    return (
    <section class="design-section">
        <div class="timeline">
                    <div class="timeline-empty"></div>
    
                    <div class="timeline-middle">
                       <div class="timeline-circle"></div>
                    </div>
                    <div class="timeline-component timeline-content">
                        <h3>HTML</h3>
                        <p>Some Text</p>
                    </div>
                    <div class="timeline-component timeline-content">
                        <h3>CSS</h3>
                        <p>Some Text.</p>
                    </div>
                    <div class="timeline-middle">
                        <div class="timeline-circle"></div>
                    </div>
                    <div class="timeline-empty"></div>
                    <div class="timeline-empty"></div>
                   <div class="timeline-middle">
                       <div class="timeline-circle"></div>
                   </div>
                   <div class=" timeline-component timeline-content">
                    <h3>Javascript</h3>
                    <p>Some Text.</p>
               </div>
           </div>
    </section>


    );
  };



export default Timeline; 


