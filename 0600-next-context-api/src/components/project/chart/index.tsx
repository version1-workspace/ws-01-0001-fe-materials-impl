"use client";
import { useEffect, useState } from "react";
import styles from "@/components/project/chart/index.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "@/services/api";
import { dataset, StatsParams } from "@/services/api/models/stats";
import { factory } from "@/services/api/models";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
);

const options = {
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: false,
    },
  },
};

const Unit = {
  year: "year",
  month: "month",
  week: "week",
  day: "day",
};

export default function Chart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await api.fetchStats();
      const stats = res.data.data.map((it: StatsParams) => factory.stats(it));
      const data = dataset(stats, Unit.day);
      setData(data as any);
    };

    init();
  }, []);

  // TODO: implemt loader
  if (data.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.chart}>
          <Bar options={options} data={data as any} />
        </div>
      </div>
    </div>
  );
}
