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

      <div class="phrase-input">
        <h3>Add phrases to learn (one per line):</h3>
        <textarea
            v-model="phrasesInput"
            placeholder="a tin of&#10;enjoy yourself&#10;omit"
            rows="5"
        />
      </div>
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

      <ExerciseList :exercises="currentExercises" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { userApi, sessionApi, chatApi } from '@/api/client';
import SessionList from '@/components/SessionList.vue';
import ChatPanel from '@/components/ChatPanel.vue';
import ExerciseList from '@/components/ExerciseList.vue';
import type { Session, ChatMessage, Exercise, Phrase } from '@/types';

const userStore = useUserStore();

const username = ref('');
const phrasesInput = ref('');
const sessions = ref<Session[]>([]);
const currentSession = ref<Session | null>(null);
const messages = ref<ChatMessage[]>([]);
const loading = ref(false);

const currentExercises = computed(() => currentSession.value?.exercises || []);

onMounted(() => {
  userStore.loadUser();
});

async function createUser() {
  if (!username.value.trim()) return;

  try {
    const response = await userApi.createUser(username.value);
    userStore.setUser(response.data);

    // Add phrases if provided
    if (phrasesInput.value.trim()) {
      const phrases: Phrase[] = phrasesInput.value
          .split('\n')
          .filter(line => line.trim())
          .map(content => ({
            id: '',
            content: content.trim()
          }));

      await userApi.addPhrases(response.data.id, phrases);
    }
  } catch (error) {
    console.error('Failed to create user:', error);
  }
}

async function createSession() {
  if (!userStore.user) return;

  try {
    const response = await sessionApi.createSession(userStore.user.id);
    sessions.value.push(response.data);
    currentSession.value = response.data;
    messages.value = [];

    // Create initial exercises
    await sessionApi.createExercises(userStore.user.id, response.data.id);
    await loadSession(response.data.id);
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

async function handleSendMessage(message: string) {
  if (!userStore.user || !currentSession.value) {
    // Auto-create session if doesn't exist
    await createSession();
    if (!currentSession.value) return;
  }

  loading.value = true;

  try {
    const response = await chatApi.sendMessage({
      userId: userStore.user!.id,
      sessionId: currentSession.value.id,
      message
    });

    // Add user message
    messages.value.push({
      content: message,
      type: 'USER'
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
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
}

.user-setup button {
  padding: 0.75rem 2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.phrase-input {
  width: 400px;
  margin-top: 2rem;
}

.phrase-input h3 {
  font-size: 14px;
  margin-bottom: 0.5rem;
}

.phrase-input textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
}

.app-container {
  display: flex;
  height: 100vh;
}
</style>