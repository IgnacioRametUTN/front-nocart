import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ReporteService from "../../services/ReporteService";
import { ReporteComponente } from "./graficos/ReporteComponente";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export const Reportes = () => {
  const [rankingArticulos, setRankingArticulos] = useState<any[]>([]);
  const [movimientos, setMovimietos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { activeSucursal } = useAuth0Extended();

  const [startDate, setStartDate] = useState<string>("2020-01-01");
  const [endDate, setEndDate] = useState<string>("2020-01-01");

  useEffect(() => {
    fecthRankingComidas(startDate, endDate);
    fetchMovimientos(startDate, endDate);
  }, [activeSucursal, startDate, endDate]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(sixMonthsAgo.toISOString().split("T")[0]);
  }, []);

  const fecthRankingComidas = async (desde: string, hasta: string) => {
    try {
      const rankingData = await ReporteService.getRankingPeriodo(
        desde,
        hasta,
        activeSucursal
      );
      setRankingArticulos(rankingData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const fetchMovimientos = async (desde: string, hasta: string) => {
    try {
      const movimientos = await ReporteService.getMovimientos(
        desde,
        hasta,
        activeSucursal
      );
      setMovimietos(movimientos);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  function generateReportFile(fileName: string, blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const filename = `${fileName}_${startDate}_${endDate}.xlsx`;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  function formatDate(dateString: string, locale = "es-ES") {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }

    const formattedDate = date.toLocaleDateString(locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  }

  const generateExcelMovimientos = async (desde: string, hasta: string) => {
    setIsGenerating(true);
    try {
      const excelData = await ReporteService.getMovimientosExcel(
        desde,
        hasta,
        activeSucursal
      );
      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      generateReportFile("reporte_movimientos", blob);
    } catch (error) {
      console.error("Error al generar el Excel:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExcelTopProducts = async (desde: string, hasta: string) => {
    setIsGenerating(true);
    try {
      const excelData = await ReporteService.getTopProductsExcel(
        desde,
        hasta,
        activeSucursal
      );
      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      generateReportFile("reporte_top_products", blob);
    } catch (error) {
      console.error("Error al generar el Excel:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generarExcelCompleto = async (desde: string, hasta: string) => {
    setIsGenerating(true);
    try {
      const excelData = await ReporteService.getReporteCompleto(
        desde,
        hasta,
        activeSucursal
      );

      const blob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      generateReportFile("reporte_general", blob);
    } catch (error: any) {
      if (error.status === 404) {
        setShowErrorModal(true);
      } else if (error instanceof Error) {
        console.log("Error:", error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Genera un reporte de pedidos completo</strong>
    </Tooltip>
  );

  return (
    <>
      <Container className="mt-4">
        <h1 className="text-center mb-4">Reportes</h1>
        {activeSucursal ? (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5>
                Reportes desde "{formatDate(startDate)}" hasta "
                {formatDate(endDate)}"
              </h5>
              <Button className="mx-3" onClick={() => setShowModal(true)}>
                Editar Fecha
              </Button>
            </div>

            <OverlayTrigger placement="right" overlay={tooltip}>
              <Button
                variant="success"
                onClick={() => generarExcelCompleto(startDate, endDate)}
                className="my-2"
                disabled={isGenerating}
              >
                {isGenerating ? "Generando..." : "Generar Reporte General"}
              </Button>
            </OverlayTrigger>

            <Row className="mb-4">
              <Col md={6}>
                <ReporteComponente
                  titulo="Ranking comidas más pedidas"
                  data={rankingArticulos}
                  typeChart="bar"
                  generateExcel={generateExcelTopProducts}
                  startDate={startDate}
                  endDate={endDate}
                />
              </Col>
              <Col md={6}>
                <ReporteComponente
                  titulo="Movimientos Monetarios"
                  data={movimientos}
                  typeChart="line"
                  generateExcel={generateExcelMovimientos}
                  startDate={startDate}
                  endDate={endDate}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <p className="text-center">Debes seleccionar una sucursal</p>
        )}
      </Container>

      {/* Modal para seleccionar fechas */}
      {showModal && (
        <Modal
          show={showModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Seleccionar Rango de Fechas
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="formStartDate">
                  <Form.Label>Fecha desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEndDate">
                  <Form.Label>Fecha hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setShowModal(false)}
            >
              Seleccionar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal de error */}
      <Modal
        show={showErrorModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Hubo un Error!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            No hay datos encontrados entre {startDate} y {endDate} para generar
            el reporte completo.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowErrorModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
