import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    function setUser(newUser: User, newToken?: string) {
        user.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
        if (newToken !== undefined) {
            token.value = newToken;
            localStorage.setItem('token', newToken);
        }
    }

    function loadUser() {
        const stored = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (stored) {
            user.value = JSON.parse(stored);
        }
        if (storedToken) {
            token.value = storedToken;
        }
    }

    function clearUser() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return { user, token, setUser, loadUser, clearUser };
});
