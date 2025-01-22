const BASE_URL = 'https://instagram-backend-at4p.onrender.com/admin/api/';

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const apiRequest = async (endpoint, method = 'GET', data = null, customHeaders = {}) => {
  const token = getToken();
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

const getData = (endpoint, customHeaders = {}) => apiRequest(endpoint, 'GET', null, customHeaders);
const postData = (endpoint, data, customHeaders = {}) => apiRequest(endpoint, 'POST', data, customHeaders);
const updateData = (endpoint, data, customHeaders = {}) => apiRequest(endpoint, 'PUT', data, customHeaders);
const deleteData = (endpoint, customHeaders = {}) => apiRequest(endpoint, 'DELETE', null, customHeaders);

export { getData, postData, updateData, deleteData, getToken, setToken, removeToken };