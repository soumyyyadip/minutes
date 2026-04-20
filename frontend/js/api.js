const API_BASE_URL = 'http://localhost:5000/api';

class Api {
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  async signup(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  async getMeetings(search = '') {
    const url = search ? `${API_BASE_URL}/meetings?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/meetings`;
    const res = await fetch(url, { headers: this.getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch meetings');
    return data;
  }

  async createMeeting(data) {
    const res = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to create meeting');
    return resData;
  }

  async cancelMeeting(id) {
    const res = await fetch(`${API_BASE_URL}/meetings/${id}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to cancel meeting');
    return resData;
  }

  async getTasks() {
    const res = await fetch(`${API_BASE_URL}/tasks`, { headers: this.getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
    return data;
  }

  async updateTaskStatus(taskId, status) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update task status');
    return resData;
  }
}

window.api = new Api();
