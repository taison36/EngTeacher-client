import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);

    function setUser(newUser: User) {
        user.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
    }

    function loadUser() {
        const stored = localStorage.getItem('user');
        if (stored) {
            user.value = JSON.parse(stored);
        }
    }

    function clearUser() {
        user.value = null;
        localStorage.removeItem('user');
    }

    return { user, setUser, loadUser, clearUser };
});