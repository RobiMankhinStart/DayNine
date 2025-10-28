import axios from "axios";
import { api } from "./api";

const API = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = "any";
    console.log(token);
    if (config) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export const ProductApi = {
  funOne: async (data) => {
    const res = await api.post("/product", data);
    return res.data;
  },
  funTwo: async (data) => {
    try {
      const res = await api.get("/product", data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },
};
