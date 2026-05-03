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

    <button class="add-phrases-btn" @click="router.push('/phrases')">
      + Add Phrases
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
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
const router = useRouter();

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
  background: var(--surface-alt);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.new-session-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 1rem;
}

.new-session-btn:hover {
  background: var(--primary-hover);
}

.sessions {
  flex: 1;
  overflow-y: auto;
}

.session-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--surface);
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--border);
  color: var(--text);
  transition: all 0.2s;
}

.session-item:hover {
  border-color: var(--primary);
}

.session-item.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.add-phrases-btn {
  width: 100%;
  padding: 0.6rem;
  background: var(--surface);
  color: var(--green);
  border: 1px solid var(--green);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 0.5rem;
}

.add-phrases-btn:hover {
  background: var(--green-light);
}
</style>