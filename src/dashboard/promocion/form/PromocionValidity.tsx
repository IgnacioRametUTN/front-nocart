import Row from "react-bootstrap/esm/Row";
import { Promocion } from "../../../entities/DTO/Promocion/Promocion";
import Form from "react-bootstrap/esm/Form";
import { FormWrapper } from "../../../components/generic/FormWrapper";
import { Col } from "react-bootstrap";

interface Props {
  promocion: Promocion;
  handleChange: (field: Partial<Promocion>) => void;
  errors: {
    fechaDesde?: string;
    fechaHasta?: string;
    horaDesde?: string;
    horaHasta?: string;
    validez?: string;
  };
}
export const PromocionValidity = ({
  promocion,
  handleChange,
  errors,
}: Props) => {
  return (
    <FormWrapper title="Validez de la Promocion">
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="fechaDesde">
            <Form.Label>Fecha Desde</Form.Label>
            <Form.Control
              type="date"
              name="fechaDesde"
              value={
                promocion.fechaDesde
                  ? new Date(promocion.fechaDesde).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange({ fechaDesde: new Date(e.target.value) })
              }
            />
            {errors.fechaDesde && (
              <Form.Text className="text-danger">{errors.fechaDesde}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="fechaHasta">
            <Form.Label>Fecha Hasta</Form.Label>
            <Form.Control
              type="date"
              name="fechaHasta"
              value={
                promocion.fechaHasta
                  ? new Date(promocion.fechaHasta).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange({ fechaHasta: new Date(e.target.value) })
              }
            />
            {errors.fechaHasta && (
              <Form.Text className="text-danger">{errors.fechaHasta}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="horaDesde">
            <Form.Label>Hora Desde</Form.Label>
            <Form.Control
              type="time"
              name="horaDesde"
              value={promocion.horaDesde || ""}
              onChange={(e) => handleChange({ horaDesde: e.target.value })}
            />
            {errors.horaDesde && (
              <Form.Text className="text-danger">{errors.horaDesde}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="horaHasta">
            <Form.Label>Hora Hasta</Form.Label>
            <Form.Control
              type="time"
              name="horaHasta"
              value={promocion.horaHasta || ""}
              onChange={(e) => handleChange({ horaHasta: e.target.value })}
            />
            {errors.horaHasta && (
              <Form.Text className="text-danger">{errors.horaHasta}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      {errors.validez && (
        <Form.Text className="text-danger">{errors.validez}</Form.Text>
      )}
    </FormWrapper>
  );
};
