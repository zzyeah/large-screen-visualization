# 📄 ZyChart

[TOC]

## 🎯 功能说明

一个基于 `Vue 3 + ECharts` 的**可复用图表组件**，具备以下核心能力：

| 特性 | 说明 |
|------|------|
| 图表初始化 | 使用 `echarts.init()` 初始化图表实例 |
| 配置更新 | 支持通过 `props.options` 动态更新图表配置 |
| 尺寸适配 | 提供 `resize()` 方法用于响应容器尺寸变化 |
| 实例暴露 | 通过 `defineExpose` 暴露 `chart`, `setOptions`, `resize` 给父组件调用 |

---

## 🧩 技术要点

| 内容 | 描述 |
|------|------|
| 模板部分 | 使用 `<div ref="chartRef">` 创建图表容器 |
| 响应式引用 | 使用 `shallowRef` 管理 DOM 和 ECharts 实例 |
| 生命周期 | 在 `onMounted` 中初始化图表 |
| 监听配置 | 使用 `watch` 监听 `props.options` 变化并更新图表 |
| 样式处理 | `.chart` 容器默认撑满父级，支持全屏展示 |

---

## 📦 props 接口（来自 `chart.interface`）

```ts
interface ChartProps {
  options: EChartsOption; // 图表配置项
}
```

---

## 📣 暴露方法

```ts
defineExpose({ chart, setOptions, resize });
```

可用于外部调用：
- 更新配置：`setOptions(newOptions)`
- 调整尺寸：`resize()`
- 获取图表实例：`chart.value`

---