<template>
  <div class="login-page">
    <div class="login-card">
      <h1>English Teacher</h1>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <input
              v-model="name"
              placeholder="Name"
              autocomplete="username"
              autofocus
          />
        </div>
        <div class="field">
          <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="actions">
          <button type="submit" :disabled="loading">
            {{ loading ? '...' : mode === 'login' ? 'Log In' : 'Register' }}
          </button>
        </div>
      </form>

      <p class="toggle">
        {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
        <button class="link-btn" @click="switchMode">
          {{ mode === 'login' ? 'Register' : 'Log In' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi, userApi } from '@/api/client';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const name = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const mode = ref<'login' | 'register'>('login');

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  error.value = '';
}

async function handleSubmit() {
  if (!name.value.trim() || !password.value) return;
  error.value = '';
  loading.value = true;

  try {
    const req = { name: name.value.trim(), password: password.value };
    const response = mode.value === 'register'
        ? await authApi.register(req)
        : await authApi.login(req);

    const { token, user } = response.data;
    userStore.setUser(user as any, token);

    const fullUser = await userApi.getUser();
    userStore.setUser(fullUser.data);

    router.push('/');
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 401) {
      error.value = 'Invalid name or password.';
    } else if (status === 409) {
      error.value = 'Name already taken.';
    } else {
      error.value = 'Something went wrong. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.login-card {
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 22px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--surface);
  color: var(--text);
  box-sizing: border-box;
}

.field input:focus {
  outline: none;
  border-color: var(--primary);
}

.actions button {
  width: 100%;
  padding: 0.7rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.actions button:hover:not(:disabled) {
  background: var(--primary-hover);
}

.actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin: 0;
  font-size: 13px;
  color: #e53e3e;
}

.toggle {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  text-decoration: underline;
}
</style>
