import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://snbl.deploy.tz/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
