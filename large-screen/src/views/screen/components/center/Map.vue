<template>
  <div class="screen-block">
    <Title>商家分布</Title>
    <div style="width: 100%; height: 90%">
      <ZyChart :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Title } from "../title";
import * as echarts from "echarts";
import mapJson from "@/assets/data/china.json";
import mapData from "@/assets/data/map.json";
import type { EChartsCoreOption } from "echarts";

onMounted(() => {
  setOptions();
});

// 注册地图数据
echarts.registerMap("china", mapJson as any);
const setOptions = () => {
  const echartsOption: EChartsCoreOption = {
    geo: {
      type: "map",
      map: "china",
      top: "5%",
      bottom: "5%",
      layoutCenter: ["50%", "50%"],
      layoutSize: "98%",
      itemStyle: {
        areaColor: "#323c48",
        borderColor: "#111",
      },
    },
    legend: {
      left: "5%",
      bottom: "5%",
      orient: "vertical",
      data: mapData.map((item: any) => item.name),
      textStyle: {
        color: "#aaa",
      },
    },
    series: mapData.map((item: any) => {
      return {
        type: "effectScatter",
        rippleEffect: {
          scale: 3,
          brushType: "stroke",
        },
        name: item.name,
        data: item.children,
        coordinateSystem: "geo",
      };
    }),
  };
  options.value = echartsOption;
};

const options = ref<EChartsCoreOption>({});
</script>

<style scoped lang="scss">
.screen-block {
  width: 100%;
  height: 100%;
}
</style>
