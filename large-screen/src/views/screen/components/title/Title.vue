<template>
  <h3 class="screen-title">
    <slot>
      {{ title }}
    </slot>
  </h3>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<style lang="scss" scoped>
.screen-title {
  position: relative;
  padding-left: 20px;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: var(--zy-screen-text-color);
  }
}
</style>
