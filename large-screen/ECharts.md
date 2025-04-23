# ECharts

## 引入
```shell
pnpm add echarts
```

### 1. 根据DOM初始化echarts实例
```ts
const chartRef = shallowRef<HTMLElement | null>(null);
const chart = shallowRef<ECharts | null>(null);

onMounted(() => {
  chart.value = echarts.init(chartRef.value);
  renderChart(); // 步骤2 + 步骤3
});
```
### 2. 构建option配置对象
```ts
const option: echarts.EChartsCoreOption = {
  title: {
      text: "销售统计",
      textStyle: {
      color: "#fff",
      },
  },
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
  legend: {
      data: [
      {
          name: "销售",
          icon: "circle",
          textStyle: {
          color: "#fff",
          },
      },
      ],
  },
  // x轴
  xAxis: {
      splitLine: {
      show: false, // 是否显示网格线
      },
      axisLine: { show: true }, // 是否显示轴线
      type: "value", // 作为数据展示
      max: function (value: any) {
      return parseInt(value.max * 1.2 + "");
      },
  },
  // y轴
  yAxis: {
      type: "category",
      data: ["商家1", "商家2", "商家3", "商家4", "商家5"],
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
      data: [5, 20, 36, 10, 10, 20],
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
```


### 3. echarts实例调用setOption方法，传入option配置对象
```ts
chart.value!.setOption(option);
```

### 页面布局
```html
<template>
  <div class="screen-block">
    <Title>销售统计</Title> <!-- 封装的组件 -->
    <div ref="chartRef" style="width: 100%; height: 90%"></div>
  </div>
</template>
```