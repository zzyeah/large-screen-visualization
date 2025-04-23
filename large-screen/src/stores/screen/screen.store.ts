import { defineStore } from "pinia";

export enum ScreenTheme {
  DARK = "dark",
  LIGHT = "light",
}

interface ScreenState {
  title: string;
  theme: ScreenTheme;
}

export const useScreenStore = defineStore<"screen", ScreenState>("screen", {
  state: () => ({
    title: "大屏数据可视化",
    theme: ScreenTheme.DARK,
  }),
});
