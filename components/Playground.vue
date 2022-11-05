
<script setup lang="ts">
import { computed, ref, Teleport } from 'vue';
import { allCratesAvailable, fetchWithTimeout } from './utils.ts';

const props = defineProps<{
  elem: Number,
  code: String,
  playgroundCrates: Array<String>,
}>();

let teleport_to = `.slidev-code-wrapper:nth-of-type(${props.elem})`;
let href_edit = `https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&code=${encodeURIComponent(props.code)}`;
let output = ref('');

let showPlay = computed(() => allCratesAvailable(props.code, props.playgroundCrates));

const PARAMS = {
  version: "stable",
  optimize: "0",
  code: props.code,
  edition: "2021"
};

const playCode = () => {
  fetchWithTimeout("https://play.rust-lang.org/evaluate.json", {
      headers: {
        'Content-Type': "application/json",
      },
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(PARAMS)
    })
    .then(res => res.json())
    .then(json => {
      output.value = json.result.trim() === '' ? '<No output>' : json.result;
    });
};
</script>

<template>
  <Teleport :to="teleport_to">
    <div class="toolbar">
      <button v-if="showPlay" :onClick="playCode">Play</button>
      <a :href="href_edit" target="_blank" rel="noreferrer noopener">Edit</a>
    </div>
    <pre class="output">{{ output }}</pre>
  </Teleport>
</template>

<style>
</style>
