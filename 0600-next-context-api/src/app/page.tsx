"use client";

import Link from "next/link";
import { Suspense } from "react";
import styles from "./page.module.css";
import Card from "@/components/project/card";
import Chart from "@/components/project/chart";
import TaskList from "@/components/tasks/list";
import route from "@/lib/route";
import useProjects from "@/contexts/projects";
import useTasks from "@/contexts/tasks";
import Icon from "@/components/shared/icon";
import { Project } from "@/services/api/models/project";

interface SummaryMetric {
  label: string;
  value: string;
  delta: string;
  progress?: number;
}

const buildSummaryMetrics = (projects: Project[]): SummaryMetric[] => {
  const stats = projects.reduce(
    (result, project) => {
      result.completed += project.stats?.states.completed || 0;
      result.scheduled += project.stats?.states.scheduled || 0;
      return result;
    },
    { completed: 0, scheduled: 0 },
  );
  const total = stats.completed + stats.scheduled;
  const completionRate = total ? Math.round((stats.completed / total) * 100) : 0;

  return [
    {
      label: "完了タスク",
      value: String(stats.completed),
      delta: "+44%",
    },
    {
      label: "予定タスク",
      value: String(stats.scheduled),
      delta: "+36%",
    },
    {
      label: "完了率",
      value: `${completionRate}%`,
      delta: "+8%",
      progress: completionRate,
    },
  ];
};

const DashboardCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <section className={[styles.cardPanel, className].join(" ")}>{children}</section>;
};

const SectionHeading = ({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className={styles.sectionHeading}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {action}
    </div>
  );
};

const SummaryMetricCard = ({ metric }: { metric: SummaryMetric }) => {
  return (
    <div className={styles.metricCard}>
      <p className={styles.metricLabel}>{metric.label}</p>
      <div className={styles.metricBody}>
        {typeof metric.progress === "number" ? (
          <div
            className={styles.progressRing}
            style={{
              background: `conic-gradient(var(--primary-color) ${metric.progress * 3.6}deg, #e7edf0 0deg)`,
            }}>
            <span>{metric.value}</span>
          </div>
        ) : (
          <strong className={styles.metricValue}>{metric.value}</strong>
        )}
        <span className={styles.metricDelta}>{metric.delta}</span>
        <span className={styles.metricDeltaLabel}>前週比</span>
      </div>
    </div>
  );
};

export default function Main() {
  const { projects } = useProjects();
  const { data } = useTasks();
  const metrics = buildSummaryMetrics(projects);

  return (
    <div className={styles.dashboardPage}>
      <h1 className={styles.pageTitle}>ダッシュボード</h1>
      <div className={styles.dashboardGrid}>
        <DashboardCard className={styles.projectPanel}>
          <SectionHeading
            title="最近のプロジェクト"
            action={
              <Link
                href={route.projects.toString()}
                className={styles.iconAction}
                aria-label="プロジェクトを作成">
                <Icon size={18} name="add" />
              </Link>
            }
          />
          <div className={styles.projectList}>
            {projects.slice(0, 3).map((item) => {
              return (
                <Link
                  key={item.slug}
                  href={route.projects.with(item.slug)}
                  className={styles.projectLink}>
                  <Card data={item} />
                </Link>
              );
            })}
          </div>
          <div className={styles.panelFooter}>
            <Link className={styles.textLink} href={route.projects.toString()}>
              すべてのプロジェクトをみる
              <Icon size={10} className={styles.linkIcon} name="arrowForward" />
            </Link>
          </div>
        </DashboardCard>
        <DashboardCard className={styles.progressPanel}>
          <SectionHeading
            title="進捗サマリー"
            action={
              <button className={styles.periodButton} type="button">
                週
                <Icon size={14} name="caretDown" />
              </button>
            }
          />
          <div className={styles.chartMeta}>
            <div className={styles.legend}>
              <span className={styles.completedLegend}></span>
              完了タスク
              <span className={styles.scheduledLegend}></span>
              予定タスク
            </div>
            <div className={styles.dateRange}>
              2026-07-17
              <Icon size={14} name="calendar" />
              <span>~</span>
              2026-07-23
              <Icon size={14} name="calendar" />
            </div>
          </div>
          <div className={styles.chartContent}>
            <Chart />
          </div>
          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <SummaryMetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </DashboardCard>
      </div>
      <DashboardCard className={styles.tasksPanel}>
        <SectionHeading
          title="タスク一覧"
          action={
          <Link href={route.tasks.toString()} className={styles.link}>
            タスク一覧
            <Icon size={10} className={styles.linkIcon} name="arrowForward" />
          </Link>
          }
        />
        <div className={styles.taskListContent}>
          <Suspense>
            <TaskList header={<></>} footer={<></>} />
          </Suspense>
        </div>
        <div className={styles.panelFooter}>
          {data ? (
            <Link href={route.tasks.toString()} className={styles.link}>
              {(data?.pageCount || 0) > 2
                ? `あと ${data.pageCount - 1} ページ`
                : "タスク一覧"}
              <Icon size={10} className={styles.linkIcon} name="arrowForward" />
            </Link>
          ) : null}
        </div>
      </DashboardCard>
    </div>
  );
}
