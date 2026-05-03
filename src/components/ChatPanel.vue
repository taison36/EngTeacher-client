<template>
  <div class="chat-panel">
    <div class="messages" ref="messagesContainer">
      <div v-if="messages.length === 0 && !loading" class="empty-state">
        Let's learn English together!
      </div>
      <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="msg.type.toLowerCase()"
      >
        <div class="content">{{ msg.content }}</div>
      </div>
      <div v-if="loading" class="message assistant pending">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    <div class="input-area">
      <textarea
          v-model="inputMessage"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="Type your message... (Enter to send)"
          rows="3"
      />
      <button @click="sendMessage" :disabled="!inputMessage.trim()">
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { ChatMessage } from '@/types';

interface Props {
  messages: ChatMessage[];
  loading?: boolean;
}

interface Emits {
  (e: 'send-message', message: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const inputMessage = ref('');
const messagesContainer = ref<HTMLElement>();

function sendMessage() {
  if (!inputMessage.value.trim()) return;

  emit('send-message', inputMessage.value.trim());
  inputMessage.value = '';
}

watch(
    () => props.messages,
    async () => {
      await nextTick();
      scrollToBottom();
    },
    { deep: true }
);

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}
</script>

<style scoped>
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--surface);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.message.user {
  align-self: flex-end;
  background: var(--user-msg-bg);
  color: var(--user-msg-text);
}

.message.assistant {
  align-self: flex-start;
  background: var(--asst-msg-bg);
  color: var(--asst-msg-text);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--border);
  font-size: 28px;
  font-weight: 600;
}

.content {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.pending {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1rem;
}

.dot {
  width: 7px;
  height: 7px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-6px); }
}

.input-area {
  border-top: 1px solid var(--border);
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
  background: var(--surface);
  color: var(--text);
}

textarea:focus {
  outline: none;
  border-color: var(--primary);
}

button {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: var(--primary-hover);
}

button:disabled {
  background: var(--border);
  cursor: not-allowed;
}
</style>