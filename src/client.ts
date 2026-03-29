import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:8030" });

export default client;
