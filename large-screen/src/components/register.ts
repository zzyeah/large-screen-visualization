import type { App, Component } from "vue";
import { ZyChart } from "./chart";

const installComponents: { [compName: string]: Component } = {
  ZyChart,
};

function install(app: App) {
  for (const key in installComponents) {
    const comp = installComponents[key];
    app.component(key, comp);
  }
}

export default {
  install,
};
