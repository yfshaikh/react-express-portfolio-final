const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000/api'
  : 'https://react-express-portfolio-final.vercel.app/api';
  

  export default API_BASE_URL;