import { createApp } from "vue";
import "@/assets/css/index.scss";
import App from "./App.vue";
import router from "./routers";
import "./components/chart/shrinking-import";
import register from "./components/register";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import pinia from "./stores";

createApp(App)
  .use(router)
  .use(register)
  .use(ElementPlus)
  .use(pinia)
  .mount("#app");
