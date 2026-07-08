<template>
  <div class="exercise-list">
    <div class="top-bar">
      <button class="icon-btn" @click="settingsOpen = true" title="Settings">⚙️</button>
      <button class="icon-btn" @click="toggle" :title="dark ? 'Light mode' : 'Dark mode'">
        {{ dark ? '☀️' : '🌙' }}
      </button>
    </div>

    <SettingsModal v-if="settingsOpen" @close="settingsOpen = false" />

    <div class="header">
      <h3>Exercises</h3>
      <span v-if="exercises.length > 0" class="progress">
        {{ doneCount }}/{{ exercises.length }}
      </span>
    </div>

    <div v-if="loading" class="skeleton-list">
      <div v-for="i in 3" :key="i" class="skeleton-item"></div>
    </div>

    <div v-else-if="exercises.length === 0" class="empty">
      No exercises yet
    </div>

    <div v-else class="exercises">
      <div
          v-for="exercise in sortedExercises"
          :key="exercise.id"
          class="exercise-item"
          :class="exercise.state.toLowerCase()"
      >
        <div class="exercise-top">
          <span v-if="exercise.state === 'COMPLETED'" class="state-badge completed">Done</span>
          <span v-else-if="exercise.state === 'FAILED'" class="state-badge failed">Failed</span>
        </div>
        <div class="question">{{ exercise.question }}</div>
      </div>
    </div>

    <button class="generate-btn" @click="emit('generate-exercises')">
      Generate Exercises
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Exercise } from '@/types';
import { useTheme } from '@/composables/useTheme';
import SettingsModal from '@/components/SettingsModal.vue';

interface Props {
  exercises: Exercise[];
  loading?: boolean;
}

interface Emits {
  (e: 'generate-exercises'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { dark, toggle } = useTheme();
const settingsOpen = ref(false);

const stateOrder: Record<string, number> = { NOT_ATTEMPTED: 0, FAILED: 1, COMPLETED: 2 };

const doneCount = computed(() => props.exercises.filter(e => e.state === 'COMPLETED').length);

const sortedExercises = computed(() =>
  [...props.exercises].sort((a, b) => stateOrder[a.state] - stateOrder[b.state])
);
</script>

<style scoped>
.exercise-list {
  width: 300px;
  height: 100vh;
  background: var(--surface-alt);
  border-left: 1px solid var(--border);
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  line-height: 1;
}

.icon-btn:hover {
  background: var(--border);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.generate-btn {
  width: 100%;
  padding: 0.5rem;
  margin-top: auto;
  background: var(--surface);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
}

.generate-btn:hover {
  background: var(--primary-light);
}

.progress {
  font-size: 13px;
  font-weight: 600;
  color: var(--green);
  background: var(--green-light);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.empty {
  color: var(--text-faint);
  text-align: center;
  margin-top: 2rem;
  font-size: 14px;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.skeleton-item {
  height: 60px;
  background: var(--border);
  border-radius: 8px;
  animation: shimmer 1.4s infinite ease-in-out;
}

.skeleton-item:nth-child(2) { animation-delay: 0.2s; }
.skeleton-item:nth-child(3) { animation-delay: 0.4s; }

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.exercises {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  overflow-y: auto;
  flex: 1;
}

.exercise-item {
  padding: 0.75rem;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.exercise-item.completed {
  opacity: 0.5;
}

.exercise-item.failed {
  border-color: var(--red, #e53e3e);
}

.exercise-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.state-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.state-badge.completed {
  color: var(--green);
  background: var(--green-light);
}

.state-badge.failed {
  color: var(--red, #e53e3e);
  background: var(--red-light, #fff5f5);
}

.question {
  font-size: 13px;
  color: var(--text);
  line-height: 1.4;
}

.exercise-item.completed .question {
  text-decoration: line-through;
  color: var(--text-faint);
}
</style>
