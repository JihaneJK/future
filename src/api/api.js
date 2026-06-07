import axios from 'axios';

// ⚠️ CHANGER À false POUR UTILISER LE BACKEND!
const USE_LOCAL_DATA = false;

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API - CORRIGÉ
export const authAPI = {
  login: async (email, password) => {
    if (USE_LOCAL_DATA) {
      return { 
        data: { 
          token: 'mock-token-123', 
          user: { id: 1, first_name: 'Ahmed', email, role: 'student' } 
        } 
      };
    }
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  register: async (data) => {
    if (USE_LOCAL_DATA) {
      return { 
        data: { 
          token: 'mock-token-123', 
          user: { id: 1, first_name: data.first_name, email: data.email, role: data.role } 
        } 
      };
    }
    const response = await api.post('/register', data);
    return response.data;
  },
  
  logout: async () => {
    try {
      if (!USE_LOCAL_DATA) {
        await api.post('/logout');
      }
    } catch (e) {}
  },
  
  getUser: async () => {
    if (USE_LOCAL_DATA) {
      return { id: 1, first_name: 'Ahmed', last_name: 'Benjelloun', email: 'ahmed@example.com', role: 'student', city: 'Fès' };
    }
    const response = await api.get('/me');
    return response.data;
  }
};

// Jobs API - CORRIGÉ
export const jobAPI = {
  getAll: async (params) => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  
  getOne: async (id) => {
    if (USE_LOCAL_DATA) {
      return { data: {} };
    }
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  
  getMy: async () => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/my-jobs');
    return response.data;
  },
  
  create: async (data) => {
    if (USE_LOCAL_DATA) {
      return { data: { id: 1 } };
    }
    const response = await api.post('/jobs', data);
    return response.data;
  },
  
  update: async (id, data) => {
    if (!USE_LOCAL_DATA) {
      const response = await api.put(`/jobs/${id}`, data);
      return response.data;
    }
  },
  
  delete: async (id) => {
    if (!USE_LOCAL_DATA) {
      await api.delete(`/jobs/${id}`);
    }
  },
  
  apply: async (jobId, data) => {
    if (USE_LOCAL_DATA) {
      return { data: {} };
    }
    const response = await api.post(`/jobs/${jobId}/apply`, data);
    return response.data;
  },

  getMyApplications: async () => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/my-applications');
    return response.data;
  }
};

// Schools API - CORRIGÉ
export const schoolAPI = {
  getAll: async (params) => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/schools', { params });
    return response.data;
  },
  
  getOne: async (id) => {
    if (USE_LOCAL_DATA) {
      return { data: {} };
    }
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },

  apply: async (schoolId) => {
    if (USE_LOCAL_DATA) {
      return { data: {} };
    }
    const response = await api.post(`/schools/${schoolId}/apply`);
    return response.data;
  }
};

// Recruiter API - CORRIGÉ
export const recruiterAPI = {
  getMyJobs: async () => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/my-jobs');
    return response.data;
  },

  getRecruiters: async () => {
    if (USE_LOCAL_DATA) {
      return [];
    }
    const response = await api.get('/recruiters');
    return response.data;
  },

  createJob: async (data) => {
    if (USE_LOCAL_DATA) {
      return { data: { id: 1 } };
    }
    const response = await api.post('/jobs', data);
    return response.data;
  },

  updateJob: async (id, data) => {
    if (!USE_LOCAL_DATA) {
      const response = await api.put(`/jobs/${id}`, data);
      return response.data;
    }
  },

  deleteJob: async (id) => {
    if (!USE_LOCAL_DATA) {
      await api.delete(`/jobs/${id}`);
    }
  },

  getApplicants: async (jobId) => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  getAllApplications: async () => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const jobs = await api.get('/my-jobs');
    const allApps = [];
    for (const job of jobs.data) {
      try {
        const apps = await api.get(`/jobs/${job.id}/applications`);
        allApps.push(...apps.data.map(a => ({ ...a, job_title: job.title, job_id: job.id })));
      } catch (e) {}
    }
    return allApps;
  },

  updateApplicationStatus: async (applicationId, status) => {
    if (!USE_LOCAL_DATA) {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      return response.data;
    }
  }
};

// Messages API - CORRIGÉ
export const messageAPI = {
  getConversations: async () => {
    if (USE_LOCAL_DATA) {
      return [];
    }
    const response = await api.get('/conversations');
    return response.data;
  },

  sendMessage: async (receiverId, message) => {
    if (USE_LOCAL_DATA) {
      return { id: Date.now(), message, receiver_id: receiverId };
    }
    const response = await api.post('/messages', { receiver_id: receiverId, message });
    return response.data;
  },

  markAsRead: async (userId) => {
    if (!USE_LOCAL_DATA) {
      await api.put(`/messages/${userId}/read`);
    }
  }
};

// Admin API - CORRIGÉ
export const adminAPI = {
  getStats: async () => {
    if (USE_LOCAL_DATA) {
      return { data: { users: 0, schools: 0, jobs: 0, reviews: 0 } };
    }
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getUsers: async () => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  updateUser: async (id, data) => {
    if (!USE_LOCAL_DATA) {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data;
    }
  },
  
  deleteUser: async (id) => {
    if (!USE_LOCAL_DATA) {
      await api.delete(`/admin/users/${id}`);
    }
  }
};

// Notifications API
export const notificationAPI = {
  getAll: async () => {
    if (USE_LOCAL_DATA) {
      return { data: [] };
    }
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    if (USE_LOCAL_DATA) {
      return { count: 0 };
    }
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAllRead: async () => {
    if (!USE_LOCAL_DATA) {
      await api.put('/notifications/read-all');
    }
  },

  markAsRead: async (id) => {
    if (!USE_LOCAL_DATA) {
      await api.patch(`/notifications/${id}/read`);
    }
  }
};

export default api;