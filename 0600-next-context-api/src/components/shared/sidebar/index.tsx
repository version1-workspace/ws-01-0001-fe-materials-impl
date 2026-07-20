"use client";
import { ReactNode, useMemo, useState, Fragment } from "react";
import styles from "@/components/shared/sidebar/index.module.css";
import { useRouter, usePathname } from "next/navigation";
import {
  IoChevronForward as ShowIcon,
  IoChevronBack as HiddenIcon,
} from "react-icons/io5";
import route from "@/lib/route";
import useProjects from "@/contexts/projects";
import { Project } from "@/services/api/models/project";
import Link from "@/components/shared/link";
import { classHelper } from "@/lib/cls";
import { truncate } from "@/lib/string";

interface MenuItem {
  title: string | ReactNode;
  path: string;
  children?: MenuItem[];
  footer?: ReactNode;
  options?: Record<string, any>;
}

const projectCountLimit = 5;

const sidebarMenulist = (projects: Project[]) => [
  {
    title: "ダッシュボード",
    path: "/",
  },
  {
    title: "タスク",
    path: route.tasks.toString(),
  },
  {
    title: <div>プロジェクト</div>,
    path: route.projects.toString(),
    children: projects.slice(0, projectCountLimit).map((it) => {
      return {
        title: it.name,
        path: route.projects.with(it.slug),
        options: {
          deadline: it.deadline?.format(),
          color: it.color,
        },
      };
    }),
    footer: (function () {
      if (projects.length <= projectCountLimit) {
        return null;
      }

      return (
        <Link href={route.projects.toString()}>
          <p className={styles.showMoreProjects}>
            あと {projects.length - projectCountLimit} プロジェクト
          </p>
        </Link>
      );
    })(),
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { projects } = useProjects();
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  const list = useMemo(() => sidebarMenulist(projects), [projects]);

  return (
    <div
      className={classHelper({
        [styles.sidebar]: true,
        [styles.sidebarShow]: show,
        [styles.sidebarHidden]: !show,
      })}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span
            className={styles.sidebarToggle}
            onClick={() => setShow((show) => !show)}>
            {show ? <HiddenIcon /> : <ShowIcon />}
          </span>
        </div>
        <div className={styles.body}>
          {show ? (
            <>
              <ul className={styles.menu}>
                {list.map((menuItem: MenuItem) => {
                  return (
                    <Fragment key={`sidebar-${menuItem.path}`}>
                      <li onClick={() => router.push(menuItem.path)}>
                        <div
                          className={classHelper({
                            [styles.menuItem]: true,
                            [styles.menuItemActive]: pathname === menuItem.path,
                          })}>
                          <div
                            className={classHelper({
                              [styles.menuTitle]: true,
                              [styles.menuTitleActive]:
                                pathname === menuItem.path,
                            })}>
                            {menuItem.title}
                          </div>
                        </div>
                      </li>
                      {menuItem.children?.length ? (
                        <ul className={styles.children}>
                          {menuItem.children.map((item) => {
                            return (
                              <li
                                key={item.path}
                                className={classHelper({
                                  [styles.menuItem]: true,
                                  [styles.menuItemActive]:
                                    pathname === item.path,
                                })}>
                                <div
                                  className={styles.project}
                                  onClick={() => router.push(item.path)}>
                                  <div>
                                    <span
                                      className={styles.dot}
                                      style={{
                                        background: item.options?.color,
                                      }}></span>
                                    {typeof item.title === "string"
                                      ? truncate(item.title, 10)
                                      : item.title}
                                  </div>
                                  <span className={styles.deadline}>
                                    {item.options?.deadline}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                      <div className={styles.menuItemFooter}>
                        {menuItem.footer}
                      </div>
                    </Fragment>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
}
