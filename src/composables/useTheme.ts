import { ref } from 'vue';

const dark = ref(localStorage.getItem('theme') === 'dark');

if (dark.value) document.body.classList.add('dark');

export function useTheme() {
    function toggle() {
        dark.value = !dark.value;
        document.body.classList.toggle('dark', dark.value);
        localStorage.setItem('theme', dark.value ? 'dark' : 'light');
    }

    return { dark, toggle };
}
