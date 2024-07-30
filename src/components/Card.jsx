import React from 'react';
import { Link } from 'react-router-dom'
import '../index.css'


const Card = ({ title, content, file, _id }) => {
  return (
      <div>
          <div className="card">
            <div className="card-content" style={{ backgroundImage: `https://react-express-portfolio-final-backend.onrender.com/${post.file}` }}><Link to={`/post/${_id}`} id='project-title'>{title}</Link></div>
          </div>
      </div>    
  );
};

export default Card;