"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import type { Project } from "@/services/api/models/project";
import styles from "./page.module.css";
import { join } from "@/lib/cls";
import Icon from "@/components/shared/icon";
import route from "@/lib/route";
import TextInput from "@/components/shared/input/text";
import useProjects from "@/contexts/projects";

interface Props {
  params: {
    slug: string;
  };
}

export default function Project({ params: { slug } }: Props) {
  const [project, setProject] = useState<Project>();
  const { projects } = useProjects();
  // FIXME: set color code by project in BE.
  const color = useMemo(
    () => projects.find((it) => it.slug === slug)?.color,
    [slug, projects],
  );

  const fetch = useCallback(async ({ slug }: { slug: string }) => {
    const res = await api.fetchProject({ slug });
    const item = factory.project({
      ...res.data.data,
    });

    setProject(item);
  }, []);

  useEffect(() => {
    fetch({ slug });
  }, []);

  if (!project) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.body}>
          <div
            className={styles.project}
            style={{
              borderLeft: `5px solid ${color}`,
            }}>
            <div className={styles.header}>
              <h1 className={styles.title} style={{ color }}>
                {" "}
                {project.isArchived ? "（アーカイブ）" : null}
                {project.name}
              </h1>
              <div className={styles.menu}></div>
            </div>
            <div className={styles.projectBody}>
              <div className={styles.field}>
                <label className={styles.label}>
                  <span className={styles.labelText}>ゴール: </span>
                </label>
                <div className={styles.goalContainer}>
                  <p className={styles.deadline}>
                    <span className={styles.fromText}>
                      あと {project.deadline?.from()} 日
                    </span>
                    <span className={styles.fromDate}>
                      ({project.deadline?.format()})
                    </span>
                  </p>
                  <p className={join(styles.text, styles.goal)}>
                    {project.goal}
                  </p>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <span className={styles.labelText}>あるべき姿: </span>
                </label>
                <p className={styles.text}>{project.shouldbe}</p>
              </div>
              <div className={styles.border}></div>
              <div className={styles.field}>
                <label className={styles.label}>スラッグ: </label>
                <p className={join(styles.text, styles.slug)}>
                  <span className={styles.slugBasePath}>
                    {route.projects.with("")}
                  </span>
                  <TextInput value={project.slug} />
                </p>
              </div>
              <div className={styles.field}>
                {project.stats ? (
                  <ul className={styles.stats}>
                    <li>
                      <div className={styles.stat}>
                        <Icon name="calendar" className={styles.statIcon} />
                        {project.stats.states.scheduled}
                      </div>
                    </li>
                    <li>
                      <div className={styles.stat}>
                        <Icon name="complete" className={styles.statIcon} />{" "}
                        {project.stats.states.completed}
                      </div>
                    </li>
                    <li>
                      <div className={join(styles.stat, styles.lastStat)}>
                        <Icon name="archive" className={styles.statIcon} />{" "}
                        {project.stats.states.archived}
                      </div>
                    </li>
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
