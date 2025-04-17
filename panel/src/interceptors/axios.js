import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.withCredentials = true; // Always send cookies


let refresh = false;//prevent make request too much

axios.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const ignoredUrls = ['auth/signup', 'auth/sign-in', 'auth/refresh-token', 'auth/sign-out'];
    const originalRequest = error.config;

    if (!error.response) {
        refresh = false;
        return Promise.reject(error);
    }

    if (error.response.status === 404) {
        refresh = false;
        const router = (await import('@/router')).default; // Lazy import
        router.push({ name: '404' }); // or use path: '/404'
    }

    if (error.response.status !== 401 || refresh || ignoredUrls.some(url => originalRequest.url.includes(url))) {
        refresh = false;
        return Promise.reject(error);
    }

    refresh = true;

    const response1 = await axios.post('auth/refresh-token', {});

    if (response1.status === 201) {
        const authStore = useAuthStore();

        axios.defaults.headers.common['Authorization'] = `Bearer ${response1.data.auth?.access_token}`;
        authStore.login(response1.data.user);

        return axios(error.config);//recall first request
    }

});
