import {
  io,
  type ManagerOptions,
  type Socket,
  type SocketOptions,
} from "socket.io-client";
import { ref } from "vue";

export enum WebSocketConnectionStatus {
  error = -1,
  disconnected = 0,
  connecting = 1,
  connected = 2,
}
export type EventCallbacks<T = any> = (data: T) => void;

export default function useWebSocket(
  url: string,
  options: Partial<ManagerOptions & SocketOptions> = {}
) {
  const {
    autoConnect = true,
    reconnectionAttempts = 3,
    reconnectionDelay = 1000,
  } = options;

  //   响应式状态
  const socket = ref<Socket | null>(null);
  const connectionStatus = ref<WebSocketConnectionStatus>(
    WebSocketConnectionStatus.disconnected
  );
  const lastError = ref<Error | null>(null);
  const eventCallbacks = new Map<string, EventCallbacks>();

  // 初始化Socket.io
  const initSocket = () => {
    socket.value = io(url, {
      autoConnect,
      reconnectionAttempts,
      reconnectionDelay,
      ...options,
    });

    socket.value.on("connect", () => {
      connectionStatus.value = WebSocketConnectionStatus.connected;
      lastError.value = null;
    });

    socket.value.on("disconnect", () => {
      connectionStatus.value = WebSocketConnectionStatus.disconnected;
    });

    socket.value.on("error", (error: Error) => {
      connectionStatus.value = WebSocketConnectionStatus.error;
      lastError.value = error;
    });

    // 通用的消息处理
    socket.value.onAny((event, data: any) => {
      const callback = eventCallbacks.get(event);
      if (callback) {
        callback(data);
      }
    });
  };

  // 订阅事件
  const subscribe = <T>(event: string, callback: EventCallbacks<T>) => {
    eventCallbacks.set(event, callback);
  };

  // 取消订阅事件
  const unsubscribe = (event: string) => {
    eventCallbacks.delete(event);
  };

  // 手动连接
  const connect = () => {
    if (!socket.value) initSocket();
    socket.value?.connect();
  };

  // 手动断开连接
  const disconnect = () => {
    socket.value?.disconnect();
    eventCallbacks.clear();
  };

  if (autoConnect) {
    initSocket();
  }

  return {
    socket,
    connectionStatus,
    lastError,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
  };
}
