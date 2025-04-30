# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 搭建思路

## 1. 选择自适应方案

### 🔍 四种主要方案（简洁归纳）

| 方案名称 | 核心技术 | 原理简述 | 优点 | 缺点 |
|----------|----------|-----------|------|------|
| **vw/vh** | CSS 视口单位 | 1vw=1%视口宽度，1vh=1%视口高度 | 简单直观，无需 JS | 大屏比例不适配时易变形 |
| **rem + vw/vh** | 动态根字体大小 + 视口单位 | 设置 `html.fontSize = 视口比例`，配合 rem 使用 | 弹性好，兼容性强 | 需 JS 或 Sass/Less 支持，配置略复杂 |
| **scale 缩放** | transform: scale | 固定设计稿尺寸，整体缩放适配屏幕 | 简洁高效，适合大屏展示 | 文字模糊、交互偏差、第三方组件错位问题 |
| **CSS原子化（如Tailwind）** | 工具类组合 | 类名即样式，通过组合快速构建响应式布局 | 高效开发，小体积 | 初期学习成本略高 |

---

### 📈 三种重点方案详解精简版

#### ✅ VW/VH 方案
- **适用场景**：简单响应式页面、移动端
- **核心代码**：
  ```css
  html { font-size: 0.625vw; }
  .box { width: 50vw; height: 30vh; }
  ```
- **注意事项**：极端屏幕比例需加约束（如 `clamp()`、宽高比控制）

---

#### ✅ REM + VW/VH 方案
- **适用场景**：PC端可视化系统、数据大屏
- **原理**：动态设置 `1rem = 设计稿宽度比例`
  - 如 `1920px设计稿 ⇒ 1rem = 19.2px`
- **优势**：设计稿像素值 / 100 = rem，方便换算
- **示例代码片段**
  ```js
  document.documentElement.style.fontSize =
    Math.min(window.innerWidth / 1920, window.innerHeight / 1080) * 100 + 'px';
  ```

---

#### ✅ Scale 缩放方案
- **适用场景**：数据大屏全屏展示
- **核心思想**：固定容器实际尺寸（如 1920×1080），通过 `transform: scale()` 适配不同分辨率屏幕
- **优点**：布局不乱，结构统一
- **缺点**：文本模糊、点击偏移、外部组件适配差
- **关键公式**
  ```ts
  const scale = Math.min(
    currentWidth / designWidth,
    currentHeight / designHeight
  );
  container.style.transform = `scale(${scale}) translate(...)`; 
  ```

---

### ⚖️ 方案对比总结表

| 特性 | vw/vh | rem+vw/vh | scale |
|------|--------|-------------|--------|
| **实现难度** | 简单 | 中等 | 简单 |
| **文字清晰度** | 好 | 好 | 可能模糊 |
| **适配精度** | 中 | 高 | 低 |
| **布局灵活性** | 中等 | 高 | 低 |
| **维护成本** | 低 | 中高 | 低 |
| **推荐使用场景** | 移动端/简单页 | 数据大屏/PC页 | 快速大屏展示 |

---

### ✅ 最佳实践建议

- 👉 **数据大屏项目**：优先选择 `rem + vw/vh` 或 `scale`。
- 👉 **移动 Web/H5**：推荐 `vw/vh` + `clamp()`。
- 👉 **快速原型/展示页面**：使用 `scale` 更快，但注意交互和组件适配问题。

---

### 🧠 总结一句话

> **根据项目类型合理选择方案：**
> 
> - 要快就用 `scale`，
> - 要稳就用 `rem + vw/vh`，
> - 要灵活用 `vw/vh 结合媒体查询`。