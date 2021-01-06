import axios from 'axios';

export default axios.create({
  //baseURL: `http://13.232.82.127:8080`,
  baseURL1: `http://localhost:3000`,
  baseURL: `https://s3p-api.azurewebsites.net/`,
  //`http://s3pbackend-env.eba-2qsibkgb.us-east-1.elasticbeanstalk.com/`,//`http://s3pdev.ap-south-1.elasticbeanstalk.com`, //`{process.env.REACT_APP_API_URL}`,//
  headers: {
    'Authorization': 'Basic c3BhZG1pbjphZG1pbg==',
    'Content-Type': 'application/json'
  }
});

const API2 = axios.create({
  //baseURL: `http://13.232.82.127:8080`,
  baseURL1: `http://localhost:3000`,
  baseURL: `http://52.188.68.6:8080/identityiq/plugin/rest`,
  headers: {
    'Authorization': 'Basic c3BhZG1pbjphZG1pbg==',
    'Content-Type': 'application/json'
  }
});

export { API2 };