import styles from "./index.module.css";
import { Filter } from "@/components/tasks/list/hooks/useFilter";
import useTasks from "@/contexts/tasks";

interface TaskListHeaderProps {
  filter: Filter;
}

const TaskListHeader = ({ filter }: TaskListHeaderProps) => {
  const { replica, update, save } = filter;
  const { data, fetch } = useTasks();

  if (!data) {
    return null;
  }

  return (
    <div className={styles.header}>
      <div className={styles.control}>
        <div className={styles.number}>
          <div className={styles.pageIndex}>
            <span>
              {data.page} / {data.pageCount}
            </span>
          </div>
          <div className={styles.displayPageCount}>
            <label>表示件数 : </label>
            <select
              className={styles.select}
              onChange={(e) => {
                const limit = Number(e.target.value);
                const newValues = { ...replica, limit };
                update({ ...newValues });
                save(newValues);
                fetch({ ...newValues, page: 1 });
              }}
              value={replica.limit}>
              <option value="20">20 件</option>
              <option value="50">50 件</option>
              <option value="100">100 件</option>
            </select>
          </div>
          <div className={styles.pageCount}>
            <span className={styles.total}>{data.total} 件</span>
          </div>
        </div>
        <div className={styles.layout}></div>
      </div>
    </div>
  );
};

export default TaskListHeader;
