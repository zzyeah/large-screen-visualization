<template>
  <div class="v-screen-box" :style="{ ...boxStyle }">
    <div class="screen-wrapper" :style="{ ...wrapperStyle }" ref="el">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onActivated, onMounted, onUnmounted, ref, watch } from "vue";
import type {
  ScaleContainerProps,
  ScaleContainerState,
} from "./scale-container.interface";
import { debounce } from "@/utils/delay.util";

let bodyOverflowHidden: string; // 初始时body的overflow值

const props = withDefaults(defineProps<ScaleContainerProps>(), {
  width: 1920,
  height: 1080,
  fullScreen: false,
  autoScale: true,
  delay: 500,
  boxStyle: () => ({}),
  wrapperStyle: () => ({}),
  bodyOverflowHidden: true,
});

const state = ref<ScaleContainerState>({
  width: 0, // 当前宽度
  height: 0, // 当前高度
  originalWidth: 0, // 原始宽度
  originalHeight: 0, // 原始高度
  observer: null, // ResizeObserver实例
});

const el = ref<HTMLElement>();

/**
 * 初始化容器尺寸（异步）
 * 优先使用props传入的宽高，否则获取DOM实际尺寸
 */
const initSize = () => {
  return new Promise<void>((resolve) => {
    // 等待DOM更新，nextTick 能保证获取到的是 DOM 更新后的最新值
    // 如果数据加载过慢，很可能导致clientWidth=0
    nextTick(() => {
      // 获取容器尺寸
      if (props.width && props.height) {
        state.value.width = props.width;
        state.value.height = props.height;
      } else {
        state.value.width = el.value?.clientWidth || 0;
        state.value.height = el.value?.clientHeight || 0;
      }

      if (state.value.originalHeight || state.value.originalWidth) {
        state.value.originalWidth = window.screen.width;
        state.value.originalHeight = window.screen.height;
      }
      resolve();
    });
  });
};

// 初始化body样式（是否隐藏滚动条）
const initBodyStyle = () => {
  if (props.bodyOverflowHidden) {
    bodyOverflowHidden = document.body.style.overflow; // 存储初始值
    document.body.style.overflow = "hidden";
  }
};

// 更新容器尺寸
const updateSize = () => {
  if (state.value.width && state.value.height) {
    el.value!.style.width = `${state.value.width}px`;
    el.value!.style.height = `${state.value.height}px`;
  } else {
    // 回退原始尺寸
    el.value!.style.width = `${state.value.originalWidth}px`;
    el.value!.style.height = `${state.value.originalHeight}px`;
  }
};

const autoScale = (scale: number) => {
  if (!props.autoScale) return;
  const wrapperW = el.value!.clientWidth;
  const wrapperH = el.value!.clientHeight;
  const currentW = document.body.clientWidth;
  const currentH = document.body.clientHeight;
  el.value!.style.transform = `scale(${scale}, ${scale})`;
  // 计算居中偏移量（确保内容始终居中）
  let maxX = Math.max((currentW - wrapperW * scale) / 2, 0);
  let maxY = Math.max((currentH - wrapperH * scale) / 2, 0);
  if (typeof props.autoScale === "object") {
    !props.autoScale.x && (maxX = 0);
    !props.autoScale.y && (maxY = 0);
  }
  el.value!.style.transform = `scale(${scale}, ${scale}) translate(${
    maxX / scale
  }px, ${maxY / scale}px)`;
};

// 计算并更新缩放比例
const updateScale = () => {
  // 获取视口尺寸
  const currentW = document.body.clientWidth;
  const currentH = document.body.clientHeight;
  // 获取大屏尺寸
  const realW = state.value.width || state.value.originalWidth;
  const realH = state.value.height || state.value.originalHeight;
  // 计算缩放比例
  const scaleW = currentW / +realW;
  const scaleH = currentH / +realH;
  // 需要判断是否全屏，若全屏需要按照各自比例缩放
  if (props.fullScreen) {
    el.value!.style.transform = `scale(${scaleW}, ${scaleH})`;
    return;
  }
  // 按照缩放最小比例进行缩放
  const minScale = Math.min(scaleW, scaleH);
  autoScale(minScale);
};

const updateLayout = async () => {
  await initSize();
  updateSize();
  updateScale();
};

watch(
  () => [props.width, props.height],
  () => updateLayout()
);

// 防抖处理：重置函数
const onResize = debounce(async () => {
  await updateLayout();
}, props.delay);

/**
 * 初始化DOM变化监听器
 * MutationObserver 可以捕获 DOM 自身属性变化（如手动修改style、动态内容导致尺寸发生变化等）
 * 可以确保当其他代码意外修改了.screen-wrapper的尺寸时，也能触发onResize,重新计算比例
 */
// const initMutationObserver = () => {
//   const mutationCallback: MutationCallback = (
//     mutations: MutationRecord[],
//     observer: MutationObserver
//   ) => {
//     // 可以作为性能优化的方案
//     for (const mutation of mutations) {
//       if (
//         mutation.type === "attributes" &&
//         mutation.attributeName === "style"
//       ) {
//         onResize();
//       }
//       console.log(`Scale Container: mutationCallback`);
//       // console.log(mutation);
//     }
//     // onResize();
//   };

//   const observer = (state.value.observer = new MutationObserver(
//     mutationCallback
//   ));
//   observer.observe(el.value!, {
//     attributes: true, // 监听属性变化
//     attributeFilter: ["style"], // 仅监听style属性
//     attributeOldValue: true, // 记录变化前的值
//   });
// };

/**
 * 初始化ResizeObserver监听器
 * ResizeObserver 可以监听DOM尺寸变化，当尺寸发生变化时，触发onResize，重新计算比例
 * 可以确保当其他代码意外修改了.screen-wrapper的尺寸时，也能触发onResize,重新计算比例
 */
const initResizeObserver = () => {
  if (!el.value) return;
  const resizeObserver = (state.value.observer = new ResizeObserver(
    (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      console.log("Scale Container: resizeObserver was triggered by accident");
      for (const entry of entries) {
        console.log(entry);
      }
      onResize();
    }
  ));
  resizeObserver.observe(el.value);
};

onMounted(() => {
  initBodyStyle();
  nextTick(async () => {
    await updateLayout();
    window.addEventListener("resize", onResize);
    initResizeObserver();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  state.value.observer?.disconnect(); // 销毁监听器
  if (props.bodyOverflowHidden) {
    document.body.style.overflow = bodyOverflowHidden;
  }
});

onActivated(updateScale);
</script>

<style scoped lang="scss">
.v-screen-box {
  overflow: hidden;
  background-size: 100% 100%;
  background-color: #000;
  width: 100vw;
  height: 100vh;
}

.screen-wrapper {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 100;
  transform-origin: left top;
}
</style>
