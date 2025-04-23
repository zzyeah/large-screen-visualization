import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import eventEmit from "./eventEmit";
import type { ResultData } from "./interface";

class Request {
  private service: AxiosInstance;

  constructor(config: CreateAxiosDefaults) {
    this.service = axios.create(config);

    // 请求拦截器
    this.service.interceptors.request.use(
      this.requestOnFulfilled,
      this.requestOnRejected
    );
    // 响应拦截器
    this.service.interceptors.response.use(
      this.responseOnFulfilled,
      this.responseOnRejected
    );
  }
  protected async requestOnFulfilled(
    config: InternalAxiosRequestConfig<any>
  ): Promise<InternalAxiosRequestConfig<any>> {
    // 添加token
    config.headers.Authorization = "Bearer " + localStorage.getItem("token");
    return config;
  }
  protected async requestOnRejected(error: AxiosError): Promise<any> {
    throw error;
  }

  protected async responseOnFulfilled(
    response: AxiosResponse<any, any>
  ): Promise<AxiosResponse<any, any>> {
    const { data } = response;
    if (data.code === RequestEnum.LOGINTIMEOUT) {
      eventEmit.emit("API:SESSION_EXPIRED", data);
      throw data;
    }
    if (data.code !== RequestEnum.SUCCESS) {
      eventEmit.emit("API:INVALID", data);
      throw data;
    }
    return response.data;
  }

  protected async responseOnRejected(error: AxiosError) {
    eventEmit.emit("API:NETWORK_ERROR", error);
    throw error;
  }

  get<T>(url: string, params?: Record<any, any>): Promise<ResultData<T>> {
    return this.service.get(url, params);
  }

  post<T>(url: string, params?: Record<any, any>): Promise<ResultData<T>> {
    return this.service.post(url, params);
  }

  put<T>(url: string, params?: Record<any, any>): Promise<ResultData<T>> {
    return this.service.put(url, params);
  }

  delete<T>(url: string, params?: Record<any, any>): Promise<ResultData<T>> {
    return this.service.delete(url, params);
  }
}

enum RequestEnum {
  TIMEOUT = 10000, // 请求超时
  FAIL = 500, // 服务器错误
  INVALID = 400, // 参数错误
  LOGINTIMEOUT = 401, // 登录超时
  SUCCESS = 200, // 请求成功
}

const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: RequestEnum.TIMEOUT,
  withCredentials: true,
};

const request = new Request(config);

export default request;
