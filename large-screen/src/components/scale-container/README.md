# Scale 自适应方案

[TOC]

## 核心思想
根据容器和视口的比例计算出容器缩放比例，得到宽高缩放比例的最小值，然后根据最小值进行缩放。

### 计算方案
1. 获取容器（Wrapper, Ww, Wh）和视口（Viewport, Vw, Vh）宽高
2. 需要添加 **缩放基准点**：`transform-origin: 0 0;`
3. 使用公式 `minScale = min(Vw/Ww, Vh/Wh)` 计算出最小缩放比例
4. 计算偏移量：`x = (Vw - Ww * minScale) / (2 * minScale), y = (Vh - Wh * minScale) / (2 * minScale)`
5. 添加**CSS**：`transform: scale(缩放比例) translate(x, y);`

### 方案注意点
1. `transform-origin: 0 0;`
- 默认是 `transform-origin: 50% 50%;`
- 确保基准点在左上角，方便之后进行定位计算。

2. `minScale = min(Vw/Ww, Vh/Wh)`
- 这种算法保证内容始终完整显示，可能出现黑边但不会溢出

3. `x = (Vw - Ww * minScale) / (2 * minScale), y = (Vh - Wh * minScale) / (2 * minScale)`
- **为什么除以缩放比例**？
  因为 `translate` 的移动距离是基于缩放后的坐标系。例如：
  - 如果缩放比例为 0.5，`translateY(100px)` 实际上会移动 50px 的物理像素
  - 需要反向补偿：`目标物理像素移动量 / scale`
  - 当然，简单点，其实也可以直接使用margin或者left、top等属性

#### 突出问题
使用scale方案是现在一些中小项目比较常用的方案，主要是代码简单方便，封装之后，基本不会涉及到后续一些处理，但是也有**非常突出的一些问题**：

1. 当大屏跟 ui 稿的比例不一样时，会出现周边留白情况
2. 缩放后可能文本模糊
3. 地图上的点位会出现偏移/点击位置不准
4. 在使用第三方组件时，比如下拉框等不会缩放