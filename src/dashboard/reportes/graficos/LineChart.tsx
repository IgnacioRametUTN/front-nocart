import { Chart } from "react-google-charts";

interface Props {
  data: any[];
  title?: string;
}

export const LineChart = ({ data }: Props) => {
  const options = {
    title: "Movimientos Monetarios",
    curveType: "function",
    legend: { position: "bottom" },
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
};
