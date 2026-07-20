"use client";
import styles from "../layout.module.css";
import Header from "@/components/shared/header/main";
import Sidebar from "@/components/shared/sidebar";
import { ModalContainer } from "@/lib/modal";
import { ToastContainer } from "@/lib/toast";
import { TaskListContainer } from "@/contexts/tasks";
import { position } from "@/lib/toast/config";
import { Inter } from "next/font/google";
import { ProjectsContainer } from "@/contexts/projects";

const inter = Inter({ subsets: ["latin"] });
export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <body className={[inter.className, styles.body].join(" ")}>
      <ProjectsContainer>
        <TaskListContainer>
          <ToastContainer
            config={{
              position: position.TOP_RIGHT,
            }}>
            <ModalContainer config={{ width: "60%" }}>
              <Header />
              <main className={styles.main}>
                <Sidebar />
                <div className={styles.mainContent}>{children}</div>
              </main>
            </ModalContainer>
          </ToastContainer>
        </TaskListContainer>
      </ProjectsContainer>
    </body>
  );
}

export const dynamic = "error";
