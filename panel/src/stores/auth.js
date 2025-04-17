import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {

    const user = reactive({
        created_at: null,
        email: null,
        id: null,
        name: null,
        updated_at: null
    });

    const isAuthReady = ref(false);

    const isAuthenticated = computed(() => null !== user.id);

    const login = (loggedInUser) => {

        Object.assign(user, loggedInUser);

    };
    const logout = () => {

        Object.assign(user, {
            created_at: null,
            email: null,
            id: null,
            name: null,
            updated_at: null
        });

    };

    const me = async () => {

        try {
            await axios.get('auth/me');
        } catch (error) {
            console.log('meeeeeeeeeeeeeeeeeeeee');
            console.log(error);
            console.log('meeeeeeeeeeeeeeeeeeeee');
        } finally {
            isAuthReady.value = true;
        }

    };

    return { user, isAuthenticated, isAuthReady, login, logout, me };
});
