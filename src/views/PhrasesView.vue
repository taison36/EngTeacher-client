<template>
  <div class="phrases-page">
    <div class="phrases-card">
      <div class="left">
        <h2>Phrases</h2>
        <p class="hint">One phrase per line</p>
        <textarea
            v-model="phrasesInput"
            placeholder="a tin of&#10;enjoy yourself&#10;omit"
            autofocus
        />
        <div class="actions">
          <button class="back-btn" v-if="existingPhrases.length > 0" @click="router.push('/')">
            Back to Chat
          </button>
          <button class="save-btn" :disabled="!phrasesInput.trim()" @click="submit">
            Save Phrases
          </button>
        </div>
      </div>

      <div class="right">
        <div class="right-header">
          <h3>Your phrases</h3>
          <button class="settings-btn" @click="settingsOpen = true" title="Settings">⚙️</button>
        </div>
        <div class="phrase-list">
          <p v-if="existingPhrases.length === 0" class="empty-hint">No phrases yet. Add some on the left.</p>
          <div v-for="phrase in existingPhrases" :key="phrase.id" class="phrase-row">
            <span class="phrase-content">{{ phrase.content }}</span>
            <div class="phrase-stats">
              <span class="stat">{{ phrase.completedExercises }} exercises done</span>
              <div class="rate-bar">
                <div class="rate-fill" :style="{ width: rateWidth(phrase.understandingRate) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings modal -->
    <div v-if="settingsOpen" class="modal-overlay" @click.self="settingsOpen = false">
      <div class="modal">
        <h2>Settings</h2>

        <div class="field">
          <label>Max exercises per session</label>
          <input type="number" v-model.number="draft.maxNumberExercises" min="1" max="50" />
        </div>

        <div class="field">
          <label>Min understanding rate</label>
          <input type="number" v-model.number="draft.minUnderstandingRate" />
        </div>

        <div class="field">
          <label>Max understanding rate</label>
          <input type="number" v-model.number="draft.maxUnderstandingRate" />
        </div>

        <div class="modal-actions">
          <button class="back-btn" @click="settingsOpen = false">Cancel</button>
          <button class="save-btn" :disabled="saving" @click="saveSettings">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { userApi } from '@/api/client';
import type { UserSettings } from '@/types';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.user) {
    router.replace('/');
    return;
  }
  try {
    const response = await userApi.getPhrases();
    userStore.user.phrases = response.data;
  } catch (error) {
    console.error('Failed to fetch phrases:', error);
  }
});

const phrasesInput = ref('');
const existingPhrases = computed(() => userStore.user?.phrases ?? []);

const settingsOpen = ref(false);
const saving = ref(false);

const draft = reactive<UserSettings>({
  maxNumberExercises: userStore.user?.settings?.maxNumberExercises ?? 10,
  minUnderstandingRate: userStore.user?.settings?.minUnderstandingRate ?? -100,
  maxUnderstandingRate: userStore.user?.settings?.maxUnderstandingRate ?? 100,
});

function rateWidth(rate: number): string {
  const settings = userStore.user?.settings;
  if (settings) {
    const min = settings.minUnderstandingRate;
    const max = settings.maxUnderstandingRate;
    if (max !== min) {
      const pct = ((rate - min) / (max - min)) * 100;
      return Math.min(Math.max(pct, 0), 100) + '%';
    }
  }
  return Math.min(rate * 10, 100) + '%';
}

async function submit() {
  if (!userStore.user || !phrasesInput.value.trim()) return;

  const phrases = phrasesInput.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(content => ({ content }));

  try {
    const response = await userApi.addPhrases(phrases);
    userStore.setUser(response.data);
    router.push('/');
  } catch (error) {
    console.error('Failed to add phrases:', error);
  }
}

async function saveSettings() {
  if (!userStore.user) return;
  saving.value = true;
  try {
    const response = await userApi.updateSettings({ ...draft });
    userStore.user.settings = response.data;
    settingsOpen.value = false;
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.phrases-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.phrases-card {
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  overflow: hidden;
  width: 70vw;
  max-width: 860px;
  height: 60vh;
}

.left {
  width: 380px;
  flex-shrink: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.right {
  flex: 1;
  border-left: 1px solid var(--border);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-shrink: 0;
}

h2 {
  margin: 0;
  font-size: 20px;
}

h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.settings-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
  line-height: 1;
}

.settings-btn:hover {
  background: var(--border);
}

.hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-faint);
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
  min-height: 200px;
  background: var(--surface);
  color: var(--text);
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.back-btn {
  padding: 0.6rem 1.25rem;
  background: var(--surface);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
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

.phrase-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.empty-hint {
  margin: 0;
  font-size: 13px;
  color: var(--text-faint);
}

.phrase-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--surface-alt);
  border-radius: 6px;
  gap: 0.75rem;
}

.phrase-content {
  font-size: 13px;
  color: var(--text);
  flex: 1;
}

.phrase-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.stat {
  font-size: 11px;
  color: var(--text-faint);
  white-space: nowrap;
}

.rate-bar {
  width: 48px;
  height: 5px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: var(--green);
  border-radius: 3px;
  transition: width 0.3s;
}

/* Modal */
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
  font-size: 18px;
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
</style>
