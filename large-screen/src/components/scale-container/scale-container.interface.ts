import type { CSSProperties } from "vue";

export interface IAutoScale {
  x?: boolean;
  y?: boolean;
}

export interface ScaleContainerProps {
  width?: number | string;
  height?: number | string;
  fullScreen?: boolean;
  autoScale?: boolean | IAutoScale;
  delay?: number;
  boxStyle?: CSSProperties;
  wrapperStyle?: CSSProperties;
  bodyOverflowHidden?: boolean;
}

export interface ScaleContainerState {
  originalWidth: string | number; // 原始设计稿宽度
  originalHeight: string | number; // 原始设计稿高度
  width?: string | number; // 当前计算宽度
  height?: string | number; // 当前计算高度
  observer: null | MutationObserver; // DOM变化观察器
}