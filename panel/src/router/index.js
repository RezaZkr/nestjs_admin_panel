import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { AuthService } from '@/services/auth/AuthService';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/access/roles',
                    name: 'access.roles',
                    component: () => import('@/views/access/roles/Index.vue')
                },
                {
                    path: '/access/roles/:id/edit',
                    name: 'access.roles.edit',
                    component: () => import('@/views/access/roles/Edit.vue')
                }
            ]
        },
        {
            path: '/pages/not-found',
            name: '404',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/auth/logout',
            name: 'logout',
            beforeEnter: async (to, from, next) => {
                await AuthService.logout();
                next({ name: 'login' });
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthReady) {
        await authStore.me();
    }

    if (to.name !== 'login' && !authStore.isAuthenticated) {
        next({ name: 'login' });
    } else if (to.name === 'login' && authStore.isAuthenticated) {
        next({ name: 'dashboard' });
    } else {
        next();
    }
});

export default router;
