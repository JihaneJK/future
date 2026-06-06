const API_URL = 'http://localhost:8000/api';

// Helper pour les requêtes
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
    throw { response: { data: error } };
  }
  
  return response.json();
};

export const authAPI = {
  login: (email, password) => 
    fetchAPI('/login', { method: 'POST', body: { email, password } }),
  
  register: (userData) => 
    fetchAPI('/register', { method: 'POST', body: userData }),
  
  logout: () => 
    fetchAPI('/logout', { method: 'POST' }),
  
  getUser: () => 
    fetchAPI('/me'),
};

export const jobsAPI = {
  getAll: () => fetchAPI('/jobs'),
  getOne: (id) => fetchAPI(`/jobs/${id}`),
  getMy: () => fetchAPI('/my-jobs'),
  create: (data) => fetchAPI('/jobs', { method: 'POST', body: data }),
  delete: (id) => fetchAPI(`/jobs/${id}`, { method: 'DELETE' }),
};

export const schoolsAPI = {
  getAll: () => fetchAPI('/schools'),
  getOne: (id) => fetchAPI(`/schools/${id}`),
};