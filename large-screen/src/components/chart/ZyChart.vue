<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import type { ECharts } from "echarts";
import { onMounted, shallowRef, watch } from "vue";
import type { ChartProps } from "./chart.interface";
import * as echarts from "echarts";

// 1. 根据DOM初始化echarts实例
const chartRef = shallowRef<HTMLElement | null>(null);
const chart = shallowRef<ECharts | null>(null);

const props = withDefaults(defineProps<ChartProps>(), {
  options: () => ({}),
});

function init() {
  if (props.options) {
    chart.value = echarts.init(chartRef.value);
    setOptions(props.options);
  }
}

function setOptions(options: any, noMerge?: boolean, lazyUpdate?: boolean) {
  if (chart.value) {
    chart.value.setOption(options, noMerge, lazyUpdate);
  }
}

onMounted(() => {
  init();
});

function resize() {
  chart.value?.resize();
}

watch(
  () => props.options,
  (newOptions) => {
    setOptions(newOptions);
  }
);

defineExpose({ chart, setOptions, resize });
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
}
</style>
