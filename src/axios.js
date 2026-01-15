import axios from 'axios';
import reduxStore from './redux';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

instance.interceptors.request.use(
    (config) => {

        const token = reduxStore.getState()?.user?.token;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
