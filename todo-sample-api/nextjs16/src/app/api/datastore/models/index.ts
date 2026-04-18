import DateDecorater from "./date";
import { type Project, ProjectModel, type ProjectParams } from "./project";
import { type Stats, StatsModel, type StatsParams } from "./stats";
import { type Task, TaskModel, type TaskParams } from "./task";
import { type User, UserModel, type UserParams } from "./user";

interface Params<T> {
  _raw: T;
}

interface HandlerParams {
  dateFields?: string[];
}

const handler = <T>({ dateFields }: HandlerParams | undefined = {}) => ({
  get: (target: Params<T>, name: string) => {
    if (name in target) {
      return target[name as keyof Params<T>];
    }

    if (dateFields?.includes(name)) {
      const value = target._raw[name as keyof T]?.toString() || "";
      return new DateDecorater(value);
    }

    return target._raw[name as keyof T];
  },
});

export const factory = {
  project: (params: ProjectParams) =>
    new Proxy(
      new ProjectModel(params),
      handler<ProjectParams>({
        dateFields: ["createdAt", "updatedAt", "deadline"],
      }),
    ) as Project,
  stats: (params: StatsParams) =>
    new Proxy(new StatsModel(params), handler<StatsParams>()) as Stats,
  task: (params: TaskParams) =>
    new Proxy(
      new TaskModel(params),
      handler<TaskParams>({
        dateFields: [
          "createdAt",
          "updatedAt",
          "finishedAt",
          "startingAt",
          "deadline",
        ],
      }),
    ) as Task,
  user: (params: UserParams) =>
    new Proxy(
      new UserModel(params),
      handler<UserParams>({
        dateFields: ["createdAt", "updatedAt"],
      }),
    ) as User,
};
