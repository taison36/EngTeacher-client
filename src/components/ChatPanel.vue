<template>
  <div class="chat-panel">
    <div class="messages" ref="messagesContainer">
      <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="msg.type.toLowerCase()"
      >
        <div class="content">{{ msg.content }}</div>
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
  background: white;
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
  background: #007bff;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background: #f1f3f4;
  color: #333;
}

.content {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.input-area {
  border-top: 1px solid #e0e0e0;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>