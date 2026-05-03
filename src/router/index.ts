import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PhrasesView from '@/views/PhrasesView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
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
    if (to.meta.requiresAuth && !localStorage.getItem('user')) {
        return { name: 'home' };
    }
});

export default router;