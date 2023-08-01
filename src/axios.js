import axios from "axios";

const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'http://ceshi13.dishait.cn';
const instance = axios.create({
    baseURL
});

export default instance;