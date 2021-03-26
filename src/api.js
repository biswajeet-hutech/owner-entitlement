import axios from 'axios';
const localMode = false;
const baseURL = window.PluginHelper ? window.PluginHelper.getPluginRestUrl("") : "/identityiq/plugin/rest/";

const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;

export {
  API,
  localMode
}
