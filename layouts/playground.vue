
<!--
This theme adds a link to the Rust playground to code snippets
  Usage:
```md
---
layout: playground
---
```rust
// Your code here
```
-->

<script setup lang="ts">
import { computed, ref } from 'vue';

import Playground from '../components/Playground.vue';
import { fetchAvailableCrates } from '../components/utils.ts';

const props = defineProps<{
  class: String;
}>();

let codeBlocks = computed(() =>
  Array.from(document.querySelectorAll('.slidev-code-wrapper')).map((wrapper) =>
    Array.from(wrapper.querySelectorAll('.shiki-dark > * > span.line'))
      .map((line) => line.textContent)
      .join('\n')
  )
);

// TODO make this a global
let playgroundCrates = ref([])
fetchAvailableCrates().then(crates => playgroundCrates.value = crates);
</script>

<template>
  <div class="slidev-layout">
    <div :class="props.class">
      <slot />
      <Playground v-for="(code, idx) in codeBlocks" :code="code" :elem="idx + 1" :playgroundCrates="playgroundCrates" />
    </div>
  </div>
</template>
