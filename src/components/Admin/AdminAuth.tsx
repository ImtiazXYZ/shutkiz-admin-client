import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAuth() {
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const APIURL = baseURL + '/api';
  const navigate = useNavigate();
  const getToken = () => {
    const tokenString = sessionStorage.getItem('access_token');
    if (tokenString) {
      const accessToken = JSON.parse(tokenString);
      return accessToken;
    }
  };
  const [token, setToken] = useState<string | null>(getToken());
  const saveToken = (token: string) => {
    sessionStorage.setItem('access_token', JSON.stringify(token));
    setToken(token);
    navigate('/');
  };
  const clearToken = () => {
    sessionStorage.removeItem('access_token');
    setToken(null);
    navigate('/');
  };
  const logout = () => {
    clearToken();
  };
  const http = axios.create({
    baseURL: `${baseURL}/api/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    setToken: saveToken,
    getToken,
    token,
    http,
    logout,
  };
}
