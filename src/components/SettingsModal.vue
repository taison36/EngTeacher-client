<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>Settings</h2>

      <div class="field">
        <label>Max exercises per session</label>
        <input type="number" v-model.number="draft.maxNumberExercises" min="1" max="50" />
      </div>

      <div class="field">
        <label>Minimum understanding rate for a phrase. This rate is updated when you complete an exercise on the phrase.</label>
        <input type="number" v-model.number="draft.minUnderstandingRate" />
      </div>

      <div class="field">
        <label>Maximum understanding rate for a phrase. This rate is updated when you complete an exercise on the phrase.</label>
        <input type="number" v-model.number="draft.maxUnderstandingRate" />
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="emit('close')">Cancel</button>
        <button class="save-btn" :disabled="saving" @click="save">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { userApi } from '@/api/client';
import type { UserSettings } from '@/types';

const emit = defineEmits<{ (e: 'close'): void }>();

const userStore = useUserStore();
const saving = ref(false);

const draft = reactive<UserSettings>({
  maxNumberExercises: userStore.user?.settings?.maxNumberExercises ?? 10,
  minUnderstandingRate: userStore.user?.settings?.minUnderstandingRate ?? -100,
  maxUnderstandingRate: userStore.user?.settings?.maxUnderstandingRate ?? 100,
});

async function save() {
  if (!userStore.user) return;
  saving.value = true;
  try {
    const response = await userApi.updateSettings(userStore.user.id, { ...draft });
    userStore.user.settings = response.data;
    emit('close');
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 13px;
  color: var(--text-muted);
}

.field input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--surface);
  color: var(--text);
}

.field input:focus {
  outline: none;
  border-color: var(--primary);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.25rem;
}

.cancel-btn {
  padding: 0.6rem 1.25rem;
  background: var(--surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background: var(--surface-alt);
}

.save-btn {
  padding: 0.6rem 1.25rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
