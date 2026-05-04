import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PhrasesView from '@/views/PhrasesView.vue';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/phrases',
            name: 'phrases',
            component: PhrasesView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach((to) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'login' };
    }
    if (to.name === 'login' && isAuthenticated) {
        return { name: 'home' };
    }
});

export default router;
