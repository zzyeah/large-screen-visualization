<template>
  <ScaleContainer>
    <div class="screen" :class="{ light: light }">
      <Header />
      <div class="screen-main">
        <div class="screen-left">
          <Left />
        </div>
        <div class="screen-center">
          <Center />
        </div>
        <div class="screen-right">
          <Right />
        </div>
      </div>
    </div>
  </ScaleContainer>
</template>

<script setup lang="ts">
import ScaleContainer from "@/components/scale-container";
import { Center, Header, Left, Right } from "./components";
import { ScreenTheme, useScreenStore } from "@/stores";
import { computed } from "vue";
const screenStore = useScreenStore();
const light = computed(() => screenStore.theme === ScreenTheme.LIGHT);
</script>

<style scoped lang="scss">
.screen {
  --zy-screen-width: 1920px;
  --zy-screen-height: 1080px;
  --zy-header-height: 72px;
  --zy-block-bg: #222733;
  --zy-screen-bg: rgb(22, 21, 24);
  --zy-screen-text-color: #fff;
  position: absolute;
  padding: 0 20px;
  background: var(--zy-screen-bg);
  color: var(--zy-screen-text-color);
  &-main {
    position: relative;
    display: flex;
    height: calc(100% - var(--zy-header-height));
  }
  &-center {
    flex: 1;
    width: calc(var(--zy-screen-width) - 1000px);
  }
  &-left,
  &-right {
    width: 460px;
  }
}

.light {
  --zy-screen-bg: rgb(238, 238, 238);
  --zy-block-bg: #fff;
  --zy-screen-text-color: rgb(22, 21, 34);
}
</style>
