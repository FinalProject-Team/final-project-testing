import axios from "axios";

const api = axios.create({
    baseURL: "https://final-project-backend-production-214a.up.railway.app/",
});

export default api;