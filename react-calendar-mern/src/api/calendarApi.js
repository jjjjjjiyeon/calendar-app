// src/api/calendarApi.js
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL; // 예: http://localhost:4000/api

const calendarApi = axios.create({
  baseURL: VITE_API_URL,
});

// 요청마다 토큰 자동 첨부
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token")||""
  };
  return config;
});

export default calendarApi;
