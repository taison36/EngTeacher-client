<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --bg:            #f0f2f5;
  --surface:       #ffffff;
  --surface-alt:   #f8f9fa;
  --border:        #e0e0e0;
  --text:          #333333;
  --text-muted:    #666666;
  --text-faint:    #999999;
  --primary:       #007bff;
  --primary-hover: #0056b3;
  --primary-light: #e8f0fe;
  --green:         #4caf50;
  --green-light:   #e8f5e9;
  --user-msg-bg:   #007bff;
  --user-msg-text: #ffffff;
  --asst-msg-bg:   #f1f3f4;
  --asst-msg-text: #333333;
}

body.dark {
  --bg:            #111111;
  --surface:       #1e1e1e;
  --surface-alt:   #181818;
  --border:        #333333;
  --text:          #e0e0e0;
  --text-muted:    #aaaaaa;
  --text-faint:    #555555;
  --primary:       #4d9fff;
  --primary-hover: #3388ee;
  --primary-light: #1a2d4d;
  --green:         #4caf50;
  --green-light:   #1a2e1a;
  --user-msg-bg:   #1a4a8a;
  --user-msg-text: #e8e8e8;
  --asst-msg-bg:   #2a2a2a;
  --asst-msg-text: #e0e0e0;
}

body {
  background: var(--bg);
  color: var(--text);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-faint);
}
</style>
