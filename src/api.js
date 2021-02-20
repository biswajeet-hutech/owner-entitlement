import axios from 'axios';
const localMode = true;
const baseURL = window.PluginHelper ? window.PluginHelper.getPluginRestUrl("") : "/identityiq/plugin/rest/";

const API = axios.create({
  // baseURL: `http://52.188.68.6:8080/identityiq/plugin/rest`,
  baseURL: baseURL,
  headers: {
    'Authorization': 'Basic c3BhZG1pbjphZG1pbg==',
    'Content-Type': 'application/json'
  }
});

export default API;

export {
  API,
  localMode
}
