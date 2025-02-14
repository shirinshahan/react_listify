import axios from 'axios';

const API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchItems = () => axios.get(API_BASE_URL);
export const createItem = (data: { title: string; body: string }) => axios.post(API_BASE_URL, data);
export const updateItem = (id: number, data: { title: string; body: string }) =>
  axios.put(`${API_BASE_URL}/${id}`, data);
export const deleteItem = (id: number) => axios.delete(`${API_BASE_URL}/${id}`);
