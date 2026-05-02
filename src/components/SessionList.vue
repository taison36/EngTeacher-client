<template>
  <div class="session-list">
    <button class="new-session-btn" @click="createNewSession">
      + New Session
    </button>

    <div class="sessions">
      <div
          v-for="session in sessions"
          :key="session.id"
          class="session-item"
          :class="{ active: session.id === currentSessionId }"
          @click="selectSession(session.id)"
      >
        <span>Session {{ sessions.indexOf(session) + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Session } from '@/types';

interface Props {
  sessions: Session[];
  currentSessionId?: string;
}

interface Emits {
  (e: 'select-session', sessionId: string): void;
  (e: 'create-session'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function selectSession(sessionId: string) {
  emit('select-session', sessionId);
}

function createNewSession() {
  emit('create-session');
}
</script>

<style scoped>
.session-list {
  width: 250px;
  height: 100vh;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.new-session-btn {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 1rem;
}

.new-session-btn:hover {
  background: #0056b3;
}

.sessions {
  flex: 1;
  overflow-y: auto;
}

.session-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.session-item:hover {
  border-color: #007bff;
}

.session-item.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
</style>