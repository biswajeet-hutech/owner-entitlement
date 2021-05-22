import axios from 'axios';
const localMode = process.env.NODE_ENV === "development";

const baseURL = window.PluginHelper ? window.PluginHelper.getPluginRestUrl("") : "/identityiq/plugin/rest/";

const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': window.PluginHelper?.getCsrfToken()
  }
});

export default API;

export {
  API,
  localMode
}
