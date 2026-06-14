import axios from "axios";
import { BASE_URL } from "../../../services/api/api";

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;