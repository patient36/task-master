import axiosBase, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1/";

const axios = axiosBase.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const baseRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("task-master-token");
    config.headers["Authorization"] = token ? `Bearer ${token}` : "";
  }
  return config;
};

const baseResponseInterceptor = (response: AxiosResponse) => response;

const baseErrorInterceptor = (error: AxiosError) => {
  const status = error.response?.status;

  if (status === 401) {
    localStorage.removeItem("task-master-token");
  }

  const data = error.response?.data as { message?: string; error?: string } | undefined;
  const message =
    data?.message ||
    data?.error ||
    error.message ||
    "Unknown error occurred";

  return Promise.reject(new Error(message));
};

axios.interceptors.request.use(baseRequestInterceptor);
axios.interceptors.response.use(baseResponseInterceptor, baseErrorInterceptor);

export default axios;
