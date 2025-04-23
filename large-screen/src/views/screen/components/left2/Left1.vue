<template>
  <div class="screen-block">
    <Title>销售统计</Title>
    <div style="width: 100%; height: 90%">
      <ZyChart :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Title } from "../title";
import * as echarts from "echarts";
import type { Sales } from "@/api/interface";
import { getSalesList } from "@/api/modules/sales";
import { useAsync } from "@/composables/useAsync";

useAsync(getSalesList, {
  onSuccess: (data) => {
    console.log("getSalesList success", data);
    if (data.code === 200) {
      setOptions(data.data!);
    }
  },
  onError: (err) => {
    console.error("getSalesList error", err);
  },
});

onMounted(() => {});

const setOptions = (state: Sales[]) => {
  options.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        z: 0,
        lineStyle: {
          color: "#2d3443",
        },
      },
    },
    //x轴
    xAxis: {
      splitLine: { show: false }, // 是否显示网格线
      axisLine: { show: true }, // 是否显示轴线
      type: "value", // 作为数据展示
    },
    //y轴
    yAxis: {
      type: "category",
      data: state.map((item) => item.name),
      inverse: true, // y轴反向
      axisLine: { show: true }, // 是否显示轴线
      axisTick: { show: false }, // 是否显示刻度
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
        data: state.map((item) => item.value),
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
};

const options = ref({});
</script>

<style scoped lang="scss">
.screen-block {
  width: 100%;
  height: 100%;
}
</style>
