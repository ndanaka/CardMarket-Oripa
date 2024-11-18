import { useTranslation } from "react-i18next";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const PieChart = ({ data }) => {
  const { t } = useTranslation();

  const initialData = {
    labels: [t("pending"), t("delivering")],
    datasets: [
      {
        label: "# of Votes",
        data: [0, 0],
        backgroundColor: ["rgba(54, 162, 235, 0.5)", "rgba(255, 0, 0, 0.3)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 0, 0, 0.6)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
  };

  if (data) {
    initialData.datasets[0].data = data;
  }

  return <Pie data={initialData} options={options} />;
};

export default PieChart;
