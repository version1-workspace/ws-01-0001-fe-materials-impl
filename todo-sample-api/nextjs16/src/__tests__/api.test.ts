import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3099/api/v1";

// -- Schema validators --

function assertPageInfo(pageInfo: Record<string, unknown>) {
  expect(pageInfo).toEqual(
    expect.objectContaining({
      totalCount: expect.any(Number),
      limit: expect.any(Number),
      page: expect.any(Number),
      hasNext: expect.any(Boolean),
      hasPrevious: expect.any(Boolean),
    }),
  );
}

function assertProject(project: Record<string, unknown>) {
  expect(project).toHaveProperty("id");
  expect(project).toHaveProperty("name");
  expect(typeof project.id).toBe("string");
  expect(typeof project.name).toBe("string");
  if (project.slug !== undefined) expect(typeof project.slug).toBe("string");
  if (project.goal !== undefined) expect(typeof project.goal).toBe("string");
  if (project.shouldbe !== undefined)
    expect(typeof project.shouldbe).toBe("string");
  if (project.color !== undefined) expect(typeof project.color).toBe("string");
  if (project.createdAt !== undefined)
    expect(typeof project.createdAt).toBe("string");
  if (project.updatedAt !== undefined)
    expect(typeof project.updatedAt).toBe("string");
}

function assertTask(task: Record<string, unknown>) {
  expect(task).toHaveProperty("id");
  expect(task).toHaveProperty("title");
  expect(task).toHaveProperty("status");
  expect(typeof task.id).toBe("string");
  expect(typeof task.title).toBe("string");
  expect(["scheduled", "completed", "archived"]).toContain(task.status);
  if (task.description !== undefined)
    expect(typeof task.description).toBe("string");
  if (task.createdAt !== undefined)
    expect(typeof task.createdAt).toBe("string");
  if (task.updatedAt !== undefined)
    expect(typeof task.updatedAt).toBe("string");
  if (task.project !== undefined)
    assertProject(task.project as Record<string, unknown>);
}

function assertStats(stats: Record<string, unknown>) {
  expect(stats).toHaveProperty("label");
  expect(stats).toHaveProperty("type");
  expect(stats).toHaveProperty("data");
  expect(typeof stats.label).toBe("string");
  expect(typeof stats.type).toBe("string");
  expect(Array.isArray(stats.data)).toBe(true);
  for (const item of stats.data as Record<string, unknown>[]) {
    expect(item).toHaveProperty("date");
    expect(item).toHaveProperty("value");
    expect(typeof item.date).toBe("number");
    expect(typeof item.value).toBe("number");
  }
}

// -- Tests --

describe("GET /api/v1", () => {
  it("returns { message: 'ok' }", async () => {
    const res = await fetch(BASE_URL);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ message: "ok" });
  });
});

describe("GET /api/v1/users/projects", () => {
  it("returns paginated project list matching swagger schema", async () => {
    const res = await fetch(`${BASE_URL}/users/projects?page=1&limit=20`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(json).toHaveProperty("pageInfo");
    expect(Array.isArray(json.data)).toBe(true);
    for (const project of json.data) {
      assertProject(project);
    }
    assertPageInfo(json.pageInfo);
  });
});

describe("GET /api/v1/users/projects/{slug}", () => {
  it("returns a project matching swagger schema", async () => {
    const res = await fetch(`${BASE_URL}/users/projects/programming`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
    assertProject(json.data);
  });

  it("returns 404 for unknown slug", async () => {
    const res = await fetch(`${BASE_URL}/users/projects/nonexistent`);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/users/tasks", () => {
  it("returns paginated task list matching swagger schema", async () => {
    const res = await fetch(
      `${BASE_URL}/users/tasks?page=1&limit=20&status=scheduled`,
    );
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(json).toHaveProperty("pageInfo");
    expect(Array.isArray(json.data)).toBe(true);
    for (const task of json.data) {
      assertTask(task);
    }
    assertPageInfo(json.pageInfo);
  });
});

describe("POST /api/v1/users/tasks", () => {
  it("creates a task and returns 201", async () => {
    const res = await fetch(`${BASE_URL}/users/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: "01aae611-e02f-46d7-997f-d88cd7842c01",
        title: "Test Task",
        kind: "task",
        status: "scheduled",
        description: "A test task",
        deadline: "2026-12-31",
        children: [],
      }),
    });
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json).toHaveProperty("data");
  });

  it("returns 400 for invalid input", async () => {
    const res = await fetch(`${BASE_URL}/users/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/users/tasks/{id}", () => {
  it("returns a task matching swagger schema", async () => {
    const listRes = await fetch(
      `${BASE_URL}/users/tasks?page=1&limit=1&status=scheduled`,
    );
    const listJson = await listRes.json();
    const taskId = listJson.data[0].id;

    const res = await fetch(`${BASE_URL}/users/tasks/${taskId}`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
    assertTask(json.data);
  });

  it("returns 404 for unknown id", async () => {
    const res = await fetch(`${BASE_URL}/users/tasks/nonexistent-id`);
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/v1/users/tasks/{id}", () => {
  it("updates a task and returns matching swagger schema", async () => {
    const listRes = await fetch(
      `${BASE_URL}/users/tasks?page=1&limit=1&status=scheduled`,
    );
    const listJson = await listRes.json();
    const taskId = listJson.data[0].id;

    const res = await fetch(`${BASE_URL}/users/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated Title" }),
    });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
    assertTask(json.data);
    expect(json.data.title).toBe("Updated Title");
  });

  it("returns 404 for unknown id", async () => {
    const res = await fetch(`${BASE_URL}/users/tasks/nonexistent-id`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/v1/users/tasks/{id}", () => {
  it("deletes a task and returns the deleted task", async () => {
    const listRes = await fetch(
      `${BASE_URL}/users/tasks?page=1&limit=1&status=scheduled`,
    );
    const listJson = await listRes.json();
    const taskId = listJson.data[0].id;

    const res = await fetch(`${BASE_URL}/users/tasks/${taskId}`, {
      method: "DELETE",
    });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
  });

  it("returns 404 for unknown id", async () => {
    const res = await fetch(`${BASE_URL}/users/tasks/nonexistent-id`, {
      method: "DELETE",
    });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/users/stats", () => {
  it("returns stats matching swagger schema", async () => {
    const res = await fetch(`${BASE_URL}/users/stats`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(Array.isArray(json.data)).toBe(true);
    for (const stats of json.data) {
      assertStats(stats);
    }
  });
});
