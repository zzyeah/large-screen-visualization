import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import Screen from "@/views/screen/index.vue";
import eventEmit from "@/api/eventEmit";
import { ElMessage } from "element-plus";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/screen" },
  { path: "/screen", component: Screen },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const goTo = (path: string) => {
  router.push(path);
};

eventEmit.on("API:INVALID", () => {
  ElMessage.error("登录超时，请重新登录");
  // goTo("/invalid");
});

eventEmit.on("API:SESSION_EXPIRED", () => {
  ElMessage.error("登录过期，请重新登录");
  // goTo("/login");
});

export default router;
