<template>
  <div class="exercise-list">
    <h3>Exercises</h3>

    <div v-if="exercises.length === 0" class="empty">
      No exercises yet
    </div>

    <div v-else class="exercises">
      <div
          v-for="exercise in exercises"
          :key="exercise.id"
          class="exercise-item"
          :class="{ done: exercise.done }"
      >
        <div class="question">{{ exercise.question }}</div>
        <div class="phrase">Phrase: "{{ exercise.phrase.content }}"</div>
        <div v-if="exercise.done" class="status">✓ Done</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '@/types';

interface Props {
  exercises: Exercise[];
}

defineProps<Props>();
</script>

<style scoped>
.exercise-list {
  width: 300px;
  height: 100vh;
  background: #f8f9fa;
  border-left: 1px solid #e0e0e0;
  padding: 1rem;
  overflow-y: auto;
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 18px;
  font-weight: 600;
}

.empty {
  color: #666;
  text-align: center;
  margin-top: 2rem;
}

.exercises {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-item {
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.exercise-item.done {
  background: #e8f5e9;
  border-color: #4caf50;
}

.question {
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: #333;
}

.phrase {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.status {
  margin-top: 0.5rem;
  color: #4caf50;
  font-size: 12px;
  font-weight: 600;
}
</style>