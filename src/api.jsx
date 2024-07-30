const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : 'https://react-express-portfolio-final.vercel.app/';
  

  export default API_BASE_URL;