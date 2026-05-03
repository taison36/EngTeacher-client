<template>
  <div class="home">
    <!-- User Setup -->
    <div v-if="!userStore.user" class="user-setup">
      <h2>Welcome to English Teacher</h2>
      <input
          v-model="username"
          @keydown.enter="createUser"
          placeholder="Enter your name"
      />
      <button @click="createUser">Start Learning</button>
    </div>

    <!-- Main App -->
    <div v-else class="app-container">
      <SessionList
          :sessions="sessions"
          :current-session-id="currentSession?.id"
          @select-session="loadSession"
          @create-session="createSession"
      />

      <ChatPanel
          :messages="messages"
          :loading="loading"
          @send-message="handleSendMessage"
      />

      <ExerciseList :exercises="currentExercises" @generate-exercises="handleGenerateExercises" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { userApi, sessionApi, chatApi } from '@/api/client';
import SessionList from '@/components/SessionList.vue';
import ChatPanel from '@/components/ChatPanel.vue';
import ExerciseList from '@/components/ExerciseList.vue';
import type { Session, ChatMessage } from '@/types';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const sessions = computed(() => userStore.user?.sessions ?? []);
const currentSession = ref<Session | null>(null);
const messages = ref<ChatMessage[]>([]);
const loading = ref(false);

const currentExercises = computed(() => currentSession.value?.exercises || []);

onMounted(async () => {
  userStore.loadUser();
  if (userStore.user) {
    try {
      const response = await userApi.getUser(userStore.user.id);
      userStore.setUser(response.data);
      await openOrCreateSession();
    } catch {
      userStore.clearUser();
    }
  }
});

async function createUser() {
  if (!username.value.trim()) return;

  try {
    let user;
    try {
      const response = await userApi.getUserByName(username.value.trim());
      user = response.data;
    } catch {
      const response = await userApi.createUser(username.value.trim());
      user = response.data;
    }
    userStore.setUser(user);
    await openOrCreateSession();
  } catch (error) {
    console.error('Failed to load or create user:', error);
  }
}

async function openOrCreateSession() {
  if ((userStore.user?.phrases?.length ?? 0) === 0) {
    router.push('/phrases');
    return;
  }
  const userSessions = userStore.user?.sessions ?? [];
  if (userSessions.length > 0) {
    await loadSession(userSessions[userSessions.length - 1].id);
  } else {
    await createSession();
  }
}

async function createSession() {
  if (!userStore.user) return;

  if ((userStore.user.phrases?.length ?? 0) === 0) {
    router.push('/phrases');
    return;
  }

  try {
    const response = await sessionApi.createSession(userStore.user.id);
    currentSession.value = response.data;
    userStore.user.sessions.push(response.data);
    messages.value = [];
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

async function loadSession(sessionId: string) {
  if (!userStore.user) return;

  try {
    const [sessionResponse, messagesResponse] = await Promise.all([
      sessionApi.getSession(userStore.user.id, sessionId),
      sessionApi.getMessages(userStore.user.id, sessionId)
    ]);

    currentSession.value = sessionResponse.data;
    messages.value = messagesResponse.data;
  } catch (error) {
    console.error('Failed to load session:', error);
  }
}

async function handleGenerateExercises() {
  if (!userStore.user || !currentSession.value) return;

  try {
    const response = await sessionApi.createExercises(userStore.user.id, currentSession.value.id);
    currentSession.value.exercises = response.data;
  } catch (error) {
    console.error('Failed to generate exercises:', error);
  }
}

async function handleSendMessage(message: string) {
  if (!userStore.user || !currentSession.value) {
    // Auto-create session if doesn't exist
    await createSession();
    if (!currentSession.value) return;
  }

  messages.value.push({ content: message, type: 'USER' });
  loading.value = true;

  try {
    const response = await chatApi.sendMessage({
      userId: userStore.user!.id,
      sessionId: currentSession.value.id,
      message
    });

    // Add agent response
    messages.value.push({
      content: response.data.agentResponse,
      type: 'ASSISTANT'
    });

    // Update exercises
    currentSession.value.exercises = response.data.exercises;
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  overflow: hidden;
}

.user-setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
  padding: 2rem;
}

.user-setup h2 {
  margin: 0 0 1rem 0;
}

.user-setup input {
  width: 300px;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 16px;
  background: var(--surface);
  color: var(--text);
}

.user-setup button {
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.app-container {
  display: flex;
  height: 100vh;
}
</style>