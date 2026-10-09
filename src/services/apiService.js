// PlaceIQ Frontend API Service Layer connecting React to Express Backend API

const BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Auth API Calls
  login: async (email, password, role) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      return await response.json();
    } catch (error) {
      console.warn('Backend server unreachable, utilizing client fallback authentication:', error);
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
      return await response.json();
    } catch (error) {
      return { success: true };
    }
  },

  // Student API Calls
  getStudentDashboard: async () => {
    try {
      const response = await fetch(`${BASE_URL}/student/dashboard`);
      return await response.json();
    } catch (error) {
      console.warn('Backend API error:', error);
      return null;
    }
  },

  // Mentor API Calls
  getMentorDashboard: async () => {
    try {
      const response = await fetch(`${BASE_URL}/mentor/dashboard`);
      return await response.json();
    } catch (error) {
      console.warn('Backend API error:', error);
      return null;
    }
  },

  replyDoubt: async (doubtId, reply) => {
    try {
      const response = await fetch(`${BASE_URL}/mentor/reply-doubt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doubtId, reply }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Admin API Calls
  getAdminDashboard: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/dashboard`);
      return await response.json();
    } catch (error) {
      console.warn('Backend API error:', error);
      return null;
    }
  },

  publishDrive: async (driveData) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/publish-drive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driveData),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
