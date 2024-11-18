import { useTranslation } from "react-i18next";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ data, type }) => {
  const { t } = useTranslation();

  const initialData = {
    labels: [],
    datasets: [
      {
        label: t("Count"),
        data: [],
        backgroundColor:
          type === "pending"
            ? "rgba(54, 162, 235, 0.3)"
            : "rgba(255, 0, 0, 0.2)",
        borderColor:
          type === "pending"
            ? "rgba(54, 162, 235, 0.5)"
            : "rgba(255, 0, 0, 0.4)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (data) {
    initialData.labels = data[0];
    initialData.datasets[0].data = data[1];
  }

  return <Line data={initialData} options={options} />;
};

export default LineChart;
