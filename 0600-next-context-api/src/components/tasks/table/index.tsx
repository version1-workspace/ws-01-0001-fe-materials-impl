import { useState } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import { classHelper, join } from "@/lib/cls";
import { statusOptions, Task } from "@/services/api/models/task";
import route from "@/lib/route";
import Select, { OptionItem } from "@/components/shared/select";
import Icon from "@/components/shared/icon";
import EditableField from "@/components/shared/editableField";
import useProjects from "@/contexts/projects";
import api from "@/services/api";

interface Props {
  data: Task[];
}

const TaskTable = ({ data }: Props) => {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <div className={join(styles.tableHeaderCell, styles.title)}>タスク</div>
        <div className={join(styles.tableHeaderCell, styles.project)}>
          プロジェクト
        </div>
        <div className={join(styles.tableHeaderCell, styles.statusHeader)}>
          ステータス
        </div>
        <div className={styles.tableHeaderCell}>期限日</div>
        <div className={join(styles.tableHeaderCell, styles.detail)}></div>
      </div>
      <div className={styles.tableBody}>
        {data.length === 0 ? (
          <div className={styles.tableRow}>
            <td>タスクが登録されていません</td>
          </div>
        ) : null}
        {data.map((it) => {
          return <Row key={it.id} data={it} />;
        })}
      </div>
    </div>
  );
};

interface SelectorProxyProps {
  options: OptionItem[];
  defaultValue: string;
  defaultOption: OptionItem;
  onSelect: (option: OptionItem) => void;
}

const SelectorProxy = ({
  options,
  defaultValue,
  defaultOption,
  onSelect,
}: SelectorProxyProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <Select
      data={options}
      value={value}
      defaultOption={defaultOption}
      onSelect={(option) => {
        setValue(option.value);
        onSelect(option);
      }}
      containerStyleClass={styles.selector}
      flat
    />
  );
};

interface RowProps {
  data: Task;
  checked?: boolean;
  onCheck?: () => void;
}

const Row = ({ data }: RowProps) => {
  const { options: projectOptions } = useProjects();

  return (
    <div key={data.id} className={styles.tableRow}>
      <div className={join(styles.tableCell, styles.title)}>
        <EditableField
          defaultValue={data.title}
          onChangeEnd={async (value) => {
            await api.updateTask(data.id, { title: value });
          }}
        />
      </div>
      <div className={join(styles.tableCell, styles.project)}>
        <SelectorProxy
          options={projectOptions}
          defaultValue={data.project.id}
          defaultOption={{
            label: "プロジェクトを選択してください",
            value: "",
          }}
          onSelect={async (option) => {
            await api.updateTask(data.id, { projectId: option.value });
          }}
        />
      </div>
      <div className={join(styles.tableCell, styles.status)}>
        <SelectorProxy
          options={statusOptions}
          defaultValue={data.status}
          defaultOption={{
            label: "ステータスを選択してください",
            value: "",
          }}
          onSelect={async (option) => {
            await api.updateTask(data.id, { status: option.value });
          }}
        />
      </div>
      <div className={styles.tableCell}>
        <EditableField
          type="date"
          defaultValue={data.deadline.format() || ""}
          onChangeEnd={(value) => {
            api.updateTask(data.id, { deadline: value });
          }}
        />
      </div>
      <div className={join(styles.tableCell, styles.detail)}>
        <Link href={route.tasks.with(data.id)}>
          <div className={styles.detailCircle}>
            <Icon className={styles.detailIcon} name="arrowForward" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TaskTable;
