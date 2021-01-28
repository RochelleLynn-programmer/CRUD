import axios from "axios";

const axiosPath = axios.create({
  baseURL: "http://localhost:4000",
});

export default axiosPath;
