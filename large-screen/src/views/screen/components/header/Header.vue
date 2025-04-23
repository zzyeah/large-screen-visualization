<template>
  <div class="screen-header">
    <h1 class="screen-logo">
      <span>Zzyeah Screen</span>
    </h1>
    <div class="screen-header-title">{{ store.title }}</div>
    <div class="screen-header-right">
      <img class="theme-change" :src="icon" alt="" @click="handleThemeChange" />
      <span class="datetime" alt="">{{ curTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import switch_dark from "@/assets/img/switch_dark.png";
import switch_light from "@/assets/img/switch_light.png";
import { ScreenTheme, useScreenStore } from "@/stores";
import dayjs from "dayjs";
import { computed, onBeforeUnmount, ref } from "vue";
const store = useScreenStore();

const curTime = ref("");
const timeId = ref();
const icon = computed(() =>
  store.theme === ScreenTheme.DARK ? switch_dark : switch_light
);
const handleThemeChange = () => {
  store.$patch({
    theme:
      store.theme === ScreenTheme.DARK ? ScreenTheme.LIGHT : ScreenTheme.DARK,
  });
};
function startTime() {
  timeId.value = setTimeout(() => {
    curTime.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
    startTime();
  }, 1000);
}

startTime();

onBeforeUnmount(() => {
  clearTimeout(timeId.value);
});
</script>

<style scoped lang="scss">
.screen-header {
  position: relative;
  width: 100%;
  height: var(--zy-header-height);
  background-size: 100% 100%;
  background-image: url("@/assets/img/header.png");
  background-repeat: no-repeat;
  animation: fade 3s;
  &-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    width: 490px;
    height: var(--zy-header-height);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .screen-logo {
    display: flex;
    align-items: center;
    height: calc(var(--zy-header-height) - 20px);
  }
  &-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-80%);
    img {
      width: 30px;
      margin-right: 16px;
      cursor: pointer;
      transition: 0.3s cubic-bezier(0.175, 0.88, 0.32, 1.275);
      &:hover {
        transform: scale(1.2);
      }
      stroke: #fff;
    }
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
