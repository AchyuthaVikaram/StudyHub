const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const session = localStorage.getItem('supabase-session');
  if (session) {
    const parsedSession = JSON.parse(session);
    return parsedSession.access_token;
  }
  return null;
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API client
export const api = {
  // Auth endpoints
  auth: {
    register: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      university: string;
      course: string;
      semester: number | null;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(userData),
      });
      return response.json();
    },

    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(credentials),
      });
      return response.json();
    },

    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: createHeaders(),
      });
      return response.json();
    },

    getCurrentUser: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: createHeaders(),
      });
      return response.json();
    },
  },

  // Notes endpoints
  notes: {
    upload: async (formData: FormData) => {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/notes/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response.json();
    },

    getAll: async (params: {
      subject?: string;
      semester?: string;
      university?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`${API_BASE_URL}/notes?${queryParams}`, {
        headers: createHeaders(false),
      });
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        headers: createHeaders(false),
      });
      return response.json();
    },

    download: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/download`, {
        method: 'POST',
        headers: createHeaders(false),
      });
      return response.json();
    },

    rate: async (id: string, rating: number) => {
      const response = await fetch(`${API_BASE_URL}/notes/${id}/rate`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ rating }),
      });
      return response.json();
    },

    getUserUploads: async () => {
      const response = await fetch(`${API_BASE_URL}/notes/user/uploads`, {
        headers: createHeaders(),
      });
      return response.json();
    },
  },

  // Search endpoints
  search: {
    notes: async (query: string, filters: Record<string, any> = {}) => {
      const queryParams = new URLSearchParams({ q: query });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`${API_BASE_URL}/search?${queryParams}`, {
        headers: createHeaders(false),
      });
      return response.json();
    },

    suggestions: async (query: string) => {
      const response = await fetch(`${API_BASE_URL}/search/suggestions?q=${query}`, {
        headers: createHeaders(false),
      });
      return response.json();
    },

    popular: async () => {
      const response = await fetch(`${API_BASE_URL}/search/popular`, {
        headers: createHeaders(false),
      });
      return response.json();
    },
  },

  // User endpoints
  users: {
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: createHeaders(),
      });
      return response.json();
    },

    updateProfile: async (profileData: {
      firstName: string;
      lastName: string;
      university: string;
      course: string;
      semester: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(profileData),
      });
      return response.json();
    },

    getDashboard: async () => {
      const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
        headers: createHeaders(),
      });
      return response.json();
    },
  },
  ai: {
    process: async (data: {
      noteId: string;
      actions: string[]; // e.g. ['summarize', 'recommend', 'categorize']
    }) => {
      const response = await fetch(`${API_BASE_URL}/ai/process`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },
};