import React from "react";

import { Bar } from "react-chartjs-2";

const labels = Array.from({ length: Math.pow(2, 8) }).map((_, i) => `${i}`);

interface HistogramBarChartProps {
  label: string;
  data: number[] | null;
  color: "R" | "G" | "B" | "GRAY";
}

const HistogramBarChart: React.FC<HistogramBarChartProps> = ({
  label,
  data,
  color,
}) => {
  if (data === null) return null;
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            borderWidth: 1,
            backgroundColor:
              color === "R"
                ? "red"
                : color === "G"
                ? "green"
                : color === "B"
                ? "blue"
                : "gray",
          },
        ],
      }}
    />
  );
};

export default HistogramBarChart;
