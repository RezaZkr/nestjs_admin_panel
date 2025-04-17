import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export const AuthService = {

    async login(credentials) {

        const response = await axios.post('auth/sign-in', credentials);

        const authStore = useAuthStore();

        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.auth?.access_token}`;

        authStore.login(response.data.user);

        return response;

    },
    async logout() {

        const response = await axios.post('auth/sign-out');

        axios.defaults.headers.common['Authorization'] = null;

        const authStore = useAuthStore();

        authStore.logout();

        return response;

    }
};
