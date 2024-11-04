import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import BarChart from "./BarChart";
import { LineChart } from "./LineChart";

interface Props {
  titulo: string;
  data: any[];
  typeChart: string;
  generateExcel: (desde: string, hasta: string) => void;
  startDate: string;
  endDate: string;
}

export const ReporteComponente = ({
  titulo,
  data,
  typeChart,
  generateExcel,
  startDate,
  endDate,
}: Props) => {
  return (
    <Container className="mt-2">
      <h3>{titulo}</h3>
      {data && data.length <= 1 ? (
        <p>No hay datos para la fecha elegida</p>
      ) : (
        <>
          {typeChart === "bar" ? (
            <BarChart title="Ranking" data={data} />
          ) : (
            <LineChart title="Ranking" data={data} />
          )}
          <Button
            className="my-4"
            variant="primary"
            onClick={() => generateExcel(startDate, endDate)}
          >
            Generar Excel
          </Button>
        </>
      )}
    </Container>
  );
};
