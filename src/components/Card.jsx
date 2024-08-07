import React from 'react';
import { Link } from 'react-router-dom'
import '../index.css'


const Card = ({ title, content, image, _id, type }) => {
  return (
      <div>
          <div className="card">
            <div className="card-content" style={{ backgroundImage: `url(${image})` }}><Link to={`/${type}/${_id}`} id='project-title'>{title}</Link></div>
          </div>
      </div>    
  );
};

export default Card; 