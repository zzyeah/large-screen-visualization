<template>
  <div class="screen-block">
    <Title>热销商品的占比</Title>
    <div style="width: 100%; height: 90%">
      <ZyChart :options="option" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Title } from "../title";

import { useAsync } from "@/composables/useAsync";
import { getHotsList } from "@/api/modules/hots";
import type { Hots } from "@/api/interface";

const option = ref({});
useAsync(getHotsList, {
  onSuccess: (data) => {
    console.log("热销数据加载成功:", data);
    if (data.code === 200) {
      setOptions(data.data!);
    }
  },
  onError: (err) => {
    console.error("热销数据加载失败:", err);
  },
});

const setOptions = (state: Hots[]) => {
  option.value = {
    grid: {
      containLabel: false,
    },
    legend: {
      bottom: "0%",
      icon: "circle",
      data: state[0].children!.map((item) => {
        return item.name;
      }),
      textStyle: {
        color: "#aaa",
      },
    },
    tooltip: {
      show: true,
      formatter: (arg: any) => {
        console.log(arg);
        const thirdCategory = arg.data.children;
        // 计算出所有三级分类的数值总和
        let total = 0;
        thirdCategory.forEach((item: any) => {
          total += item.value;
        });
        let retStr = "";
        thirdCategory.forEach((item: any) => {
          retStr += `
            ${item.name}:${Math.floor((item.value / total) * 100) + "%"}
            <br/>
          `;
        });
        return retStr;
      },
    },
    series: [
      {
        type: "pie",
        label: {
          show: false,
        },
        data: state[0].children!.map((item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children, // 新增加children的原因是为了在tooltip中的formatter的回调函数中,来拿到这个二级分类下的三级分类数据
          };
        }),
      },
    ],
  };
};
</script>

<style lang="scss" scoped>
.screen-block {
  width: 100%;
  height: 100%;
}
</style>
