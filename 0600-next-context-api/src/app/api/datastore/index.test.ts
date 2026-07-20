
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { init, getTasks, getProjects, getStats, setTasks, getUUID } from './index';
import dayjs from 'dayjs';

describe('Datastore', () => {
  beforeEach(() => {
    // Reset the datastore before each test
    init();
  });

  afterEach(() => {
    // Clean up after each test
    // @ts-ignore
    globalThis.__datastore = undefined;
  });

  describe('initialization', () => {
    it('should initialize datastore with default data', () => {
      expect(getTasks()).toBeDefined();
      expect(getTasks().length).toBe(100);
      expect(getProjects()).toBeDefined();
      expect(getProjects().length).toBe(3);
      expect(getStats()).toBeDefined();
      expect(getStats().length).toBe(2);
    });
  });

  describe('getTasks', () => {
    it('should return array of tasks', () => {
      const tasks = getTasks();
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks[0]).toMatchObject({
        kind: 'task',
        status: 'scheduled',
        title: 'タスク 1',
      });
    });

    it('should initialize datastore if not initialized', () => {
      // @ts-ignore
      globalThis.__datastore = undefined;
      const tasks = getTasks();
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBe(100);
    });
  });

  describe('getProjects', () => {
    it('should return array of projects', () => {
      const projects = getProjects();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects[0]).toMatchObject({
        name: 'プログラミング',
        slug: 'programming',
      });
    });

    it('should initialize datastore if not initialized', () => {
      // @ts-ignore
      globalThis.__datastore = undefined;
      const projects = getProjects();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(3);
    });
  });

  describe('getStats', () => {
    it('should return array of stats', () => {
      const stats = getStats();
      expect(Array.isArray(stats)).toBe(true);
      expect(stats[0]).toMatchObject({
        label: '完了タスク',
        type: 'completed',
      });
      expect(stats[1]).toMatchObject({
        label: '予定タスク',
        type: 'todo',
      });
    });

    it('should have correct data structure for stats', () => {
      const stats = getStats();
      stats.forEach((stat: any) => {
        expect(stat.data).toHaveLength(7);
        stat.data.forEach((item: any) => {
          expect(item).toHaveProperty('date');
          expect(item).toHaveProperty('value');
          expect(typeof item.date).toBe('number');
          expect(typeof item.value).toBe('number');
        });
      });
    });
  });

  describe('setTasks', () => {
    it('should update tasks in datastore', () => {
      const newTasks = [
        {
          id: 'test-id',
          description: 'Test task',
          kind: 'task',
          title: 'Test Title',
          status: 'scheduled',
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
          deadline: dayjs().add(14, 'days').format(),
          children: [],
          project: getProjects()[0],
        },
      ];

      setTasks(newTasks);
      expect(getTasks()).toEqual(newTasks);
    });

    it('should initialize datastore if not initialized when setting tasks', () => {
      // @ts-ignore
      globalThis.__datastore = undefined;
      const newTasks = [{ id: 'test-id', title: 'Test Task' }];
      setTasks(newTasks);
      expect(getTasks()).toEqual(newTasks);
    });
  });

  describe('getUUID', () => {
    it('should return next UUID from the sequence', () => {
      const tasks = getTasks();
      const lastTaskId = tasks[tasks.length - 1].id;
      const nextUUID = getUUID();
      expect(typeof nextUUID).toBe('string');
      expect(nextUUID).not.toBe(lastTaskId);
    });
  });
});
