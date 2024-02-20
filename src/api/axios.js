import axios from 'axios';

const BASE_URL = 'https://precsys2.vercel.app/api'

export default axios.create({
  baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true
})