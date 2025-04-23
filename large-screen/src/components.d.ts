import { Chart } from "./components/chart";
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    ZyChart: typeof Chart;
  }
}
