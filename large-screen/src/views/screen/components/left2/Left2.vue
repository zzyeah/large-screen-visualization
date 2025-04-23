<template>
  <div class="screen-block">
    <Title>地区销量趋势</Title>
    <div style="width: 100%; height: 90%">
      <ZyChart :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { Title } from "../title";
import { ref } from "vue";
import { useAsync } from "@/composables/useAsync";
import { getTrendsList } from "@/api/modules/trends";
import type { Trends } from "@/api/interface";
const options = ref<echarts.EChartsCoreOption>({});

useAsync(getTrendsList, {
  onSuccess(data) {
    console.log("getTrendsList success", data);
    setOptions(data.data!);
  },
  onError(error) {
    console.error("getTrendsList error", error);
  },
});

const setOptions = (res: Trends[]) => {
  options.value = {
    grid: {
      top: "25%",
      right: "4%",
      bottom: "1%",
      left: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      left: 20,
      top: "8%",
      icon: "circle",
      data: res.map((item) => item.name),
      textStyle: {
        color: "#aaa",
      },
    },
    xAxis: {
      type: "category",
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    series: getSeries(res),
  };
};

function getSeries(data: Trends[]) {
  // 半透明的颜色值
  const colorArr1 = [
    "rgba(11, 168, 44, 0.5)",
    "rgba(44, 110, 255, 0.5)",
    "rgba(22, 242, 217, 0.5)",
    "rgba(254, 33, 30, 0.5)",
    "rgba(250, 105, 0, 0.5)",
  ];
  // 全透明的颜色值
  const colorArr2 = [
    "rgba(11, 168, 44, 0)",
    "rgba(44, 110, 255, 0)",
    "rgba(22, 242, 217, 0)",
    "rgba(254, 33, 30, 0)",
    "rgba(250, 105, 0, 0)",
  ];

  const seriesArr: any[] = data.map((item, index) => ({
    name: item.name,
    type: "line",
    data: item.data,
    lineStyle: {
      width: 3,
    },
    itemStyle: {
      borderWidth: 4,
    },
    symbol: "circle",
    smooth: true,
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colorArr1[index] },
        { offset: 1, color: colorArr2[index] },
      ]),
    },
  }));
  return seriesArr;
}
</script>

<style scoped lang="scss">
.screen-block {
  width: 100%;
  height: 100%;
}
</style>
