<template>
  <div class="screen-block">
    <Title>销售统计</Title>
    <div ref="chartRef" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script setup lang="ts">
import type { ECharts } from "echarts";
import * as echarts from "echarts";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { Title } from "../title";
import { io, Socket } from "socket.io-client";
// 1. 根据DOM初始化echarts实例
const chartRef = shallowRef<HTMLElement | null>(null);
const chart = shallowRef<ECharts | null>(null);

// Socket.io
const socket = ref<Socket | null>(null);
const connectionStatus = ref<"connected" | "disconnected">("disconnected");

const initSocket = () => {
  socket.value = io("http://localhost:3000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // 连接事件
  socket.value.on("connect", () => {
    connectionStatus.value = "connected";
    console.log("Socket.io connected");
  });

  socket.value.on("disconnect", () => {
    connectionStatus.value = "disconnected";
    console.log("Socket.io disconnected");
  });

  socket.value.on("salesData", handleData);
};

const handleData = (newData: { name: string; value: number }[]) => {
  if (!chart?.value) return;

  const categories = newData.map((item) => item.name);
  const values = newData.map((item) => item.value);

  chart.value!.setOption({
    yAxis: {
      data: categories,
    },
    series: [{ data: values }],
  });
};

const initChart = () => {
  chart.value = echarts.init(chartRef.value!);
  const initialOptions: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        z: 0,
        lineStyle: {
          color: "#2D3443",
        },
      },
    },
    // x轴
    xAxis: {
      splitLine: {
        show: false, // 是否显示网格线
      },
      axisLine: { show: true }, // 是否显示轴线
      type: "value", // 作为数据展示
    },
    // y轴
    yAxis: {
      type: "category",
      data: [],
      inverse: true, // y轴反向
      axisLine: { show: true }, // 是否显示轴线
      axisTick: { show: false }, // 是否显示刻度线
      axisLabel: {
        color: "#fff",
      },
    },
    grid: {
      top: "3%",
      right: "4%",
      bottom: "3%",
      left: "3%",
      containLabel: true,
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
          position: "right",
        },
        data: [],
        barWidth: 22,
        roundCap: true,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(220, 220, 220, 0.3)",
        },
        itemStyle: {
          borderWidth: 0,
          borderRadius: [0, 10, 10, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#00fffb",
            },
            {
              offset: 1,
              color: "#0061ce",
            },
          ]),
        },
      },
    ],
  };

  chart.value!.setOption(initialOptions);
};
onMounted(() => {
  initSocket();
  initChart();
});

onBeforeUnmount(() => {
  socket.value?.disconnect();
});
</script>

<style scoped lang="scss">
.screen-block {
  width: 100%;
  height: 460px;
  background-color: var(--zy-block-bg);
  padding: 16px;
  margin-top: 20px;
}
</style>
