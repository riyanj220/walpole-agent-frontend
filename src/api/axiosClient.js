import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://walpole-agent-b6auf5bwc0bte8fv.centralindia-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 150000
});

export default axiosClient;
