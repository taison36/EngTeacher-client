<template>
  <div class="home">
    <div class="app-container">
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

      <ExerciseList
          :exercises="currentExercises"
          :loading="sessionLoading"
          @generate-exercises="handleGenerateExercises"
      />
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

const sessions = computed(() => userStore.user?.sessions ?? []);
const currentSession = ref<Session | null>(null);
const messages = ref<ChatMessage[]>([]);
const loading = ref(false);
const sessionLoading = ref(false);

const currentExercises = computed(() => currentSession.value?.exercises || []);

onMounted(async () => {
  userStore.loadUser();
  try {
    const response = await userApi.getUser();
    userStore.setUser(response.data);
    await openOrCreateSession();
  } catch {
    userStore.clearUser();
    router.push('/login');
  }
});

async function openOrCreateSession() {
  if ((userStore.user?.phrases?.length ?? 0) === 0) {
    router.push('/phrases');
    return;
  }
  const userSessions = userStore.user?.sessions ?? [];
  if (userSessions.length > 0) {
    const mostRecent = [...userSessions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    await loadSession(mostRecent.id);
  } else {
    await createSession();
  }
}

async function createSession() {
  try {
    const response = await sessionApi.createSession();
    currentSession.value = response.data;
    userStore.user!.sessions.push(response.data);
    messages.value = [];
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

async function loadSession(sessionId: string) {
  sessionLoading.value = true;
  try {
    const [sessionResponse, messagesResponse] = await Promise.all([
      sessionApi.getSession(sessionId),
      sessionApi.getMessages(sessionId)
    ]);

    currentSession.value = sessionResponse.data;
    messages.value = messagesResponse.data;

    const idx = userStore.user!.sessions.findIndex(s => s.id === sessionId);
    if (idx !== -1) userStore.user!.sessions[idx] = sessionResponse.data;
  } catch (error) {
    console.error('Failed to load session:', error);
  } finally {
    sessionLoading.value = false;
  }
}

async function handleGenerateExercises() {
  if (!currentSession.value) return;
  try {
    const response = await sessionApi.createExercises(currentSession.value.id);
    currentSession.value.exercises = response.data;
  } catch (error) {
    console.error('Failed to generate exercises:', error);
  }
}

async function handleSendMessage(message: string) {
  if (!currentSession.value) {
    await createSession();
    if (!currentSession.value) return;
  }

  messages.value.push({ content: message, type: 'USER' });
  loading.value = true;

  try {
    const response = await chatApi.sendMessage({
      sessionId: currentSession.value.id,
      message
    });

    messages.value.push({
      content: response.data.agentResponse,
      type: 'ASSISTANT'
    });

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

.app-container {
  display: flex;
  height: 100vh;
}
</style>
