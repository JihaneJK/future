const API_URL = 'http://localhost:8000/api';

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response.json();
};

export const authAPI = {
  register: (data) => fetchAPI('/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (email, password) => fetchAPI('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => fetchAPI('/logout', { method: 'POST' }),
  me: () => fetchAPI('/me'),
};

export const jobsAPI = {
  getAll: () => fetchAPI('/jobs'),
  getOne: (id) => fetchAPI(`/jobs/${id}`),
  getMy: () => fetchAPI('/my-jobs'),
  create: (data) => fetchAPI('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/jobs/${id}`, { method: 'DELETE' }),
};

export const schoolsAPI = {
  getAll: () => fetchAPI('/schools'),
  getOne: (id) => fetchAPI(`/schools/${id}`),
};