<template>
  <div class="screen-app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped lang="scss">
.screen-app {
  width: 100%;
  height: 100%;
}
</style>
