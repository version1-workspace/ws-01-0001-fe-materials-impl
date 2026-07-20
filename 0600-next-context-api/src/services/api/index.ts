import axios, { AxiosError, AxiosInstance } from "axios";

const _sessionStorage =
  typeof sessionStorage !== "undefined" ? sessionStorage : undefined;

export const getAccessToken = () => _sessionStorage?.getItem("token") || "";

export const setUserId = (uuid: string) => localStorage.setItem("uuid", uuid);
export const getUserId = () => localStorage.getItem("uuid") || "";

class Client {
  _instance?: AxiosInstance;
  _errorHandler?: (error: AxiosError) => void;

  constructor(config: {
    baseURL: string;
    timeout: number;
    withCredentials?: boolean;
    headers: {
      Authorization?: string;
    };
  }) {
    this._instance = axios.create({
      ...config,
      headers: {
        ...(config.headers || {}),
      },
    });
    this._instance.defaults.headers["Authorization"] =
      `Bearer ${getAccessToken()}`;
  }

  get instance() {
    if (!this._instance) {
      throw new Error("client is not initialized properly");
    }

    return this._instance;
  }

  setAccessToken = (token: string) => {
    _sessionStorage?.setItem("token", token);
    if (this._instance) {
      this._instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  };

  setErrorHandler = (handler: (error: AxiosError) => void) => {
    this.instance.interceptors.response.use(function (response) {
      return response;
    }, handler);
  };
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const client = new Client({
  baseURL: `${baseURL}/api/v1`,
  timeout: 1000,
  withCredentials: true,
  headers: { Authorization: getAccessToken() },
});

const api = {
  client,
  refreshToken: ({ uuid }: { uuid: string }) => {
    return client.instance.post("/auth/refresh", {
      uuid,
    });
  },
  logout: () => {
    return client.instance.delete("/auth/refresh");
  },
  fetchUser: () => {
    return client.instance.get("/users/me");
  },
  fetchProject: ({ slug }: { slug: string }) => {
    return client.instance.get(`/users/projects/${slug}`);
  },
  fetchProjects: ({
    limit,
    page,
    status,
  }: Partial<{
    limit: number;
    page: number;
    status: string[];
  }>) => {
    return client.instance.get("/users/projects", {
      params: {
        limit,
        page,
        status,
      },
    });
  },
  fetchStats() {
    return client.instance.get(`/users/stats`);
  },
  fetchTask: ({ id }: { id: string }) => {
    return client.instance.get(`/users/tasks/${id}`);
  },
  fetchTasks: ({
    page,
    status,
    limit,
    search,
    sortType,
    sortOrder,
    dateFrom,
    dateTo,
    dateType,
    projectId,
  }: Partial<{
    page: number;
    status: string[];
    limit: number;
    search: string;
    sortType: string;
    sortOrder: string;
    dateFrom: string;
    dateTo: string;
    dateType: string;
    projectId: string;
  }>) => {
    return client.instance.get("/users/tasks", {
      params: {
        page,
        status,
        limit,
        search,
        sortType,
        sortOrder,
        dateFrom,
        dateTo,
        dateType,
        projectId,
      },
    });
  },
  createTask: ({
    data,
  }: {
    data: Partial<{
      title: string;
      projectId: string;
      deadline: string;
      startingAt: string;
      finishedAt: string;
      status: string;
      kind: string;
    }>;
  }) => {
    return client.instance.post(`/users/tasks`, data);
  },
  updateTask: (
    id: string,
    data: Partial<{
      title: string;
      projectId: string;
      parentId: string;
      deadline: string;
      startingAt: string;
      finishedAt: string;
      status: string;
      kind: string;
    }>,
  ) => {
    const _data = Object.keys(data).reduce((acc, key) => {
      const v = data[key as keyof typeof data];
      if (["deadline", "startingAt", "finishedAt"].includes(key)) {
        return {
          ...acc,
          [key]: v?.replaceAll("/", "-"),
        };
      }

      return {
        ...acc,
        [key]: v,
      };
    }, {});
    return client.instance.patch(`/users/tasks/${id}`, _data);
  },
  deleteTask: ({ id }: { id: string }) => {
    return client.instance.delete(`/users/tasks/${id}`);
  },
  authenticate: async ({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const res = await client.instance.post("/auth/login", {
      email,
      password,
      rememberMe,
    });

    return res.data;
  },
};

export default api;
