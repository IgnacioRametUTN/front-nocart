import Row from "react-bootstrap/esm/Row";
import { Promocion } from "../../../entities/DTO/Promocion/Promocion";
import Form from "react-bootstrap/esm/Form";
import { TipoPromocion } from "../../../entities/enums/TipoPromocion";
import { FormWrapper } from "../../../components/generic/FormWrapper";

interface Props {
  promocion: Promocion;
  handleChange: (field: Partial<Promocion>) => void;
  errors: {
    denominacion?: string;
    descripcionDescuento?: string;
    tipoPromocion?: string;
  };
}
export const PromocionDetails = ({
  promocion,
  handleChange,
  errors,
}: Props) => {
  return (
    <FormWrapper title="Detalles de la Promoción">
      <Row className="mb-3">
        <Form.Group controlId="denominacion">
          <Form.Label>Denominación</Form.Label>
          <Form.Control
            type="text"
            name="denominacion"
            value={promocion.denominacion}
            onChange={(e) => handleChange({ denominacion: e.target.value })}
            isInvalid={!!errors.denominacion}
          />
          {errors.denominacion && (
            <Form.Text className="text-danger">{errors.denominacion}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="tipoPromocion">
          <Form.Label>Tipo de Promoción</Form.Label>
          <Form.Select
            value={promocion.tipoPromocion}
            onChange={(e) => {
              const selectedValue = e.target
                .value as keyof typeof TipoPromocion;
              const tipoPromocion = TipoPromocion[selectedValue];
              handleChange({ tipoPromocion });
            }}
          >
            <option value="">Seleccionar...</option>
            <option value={TipoPromocion.Promocion}>Promoción</option>
            <option value={TipoPromocion.HappyHour}>Happy Hour</option>
          </Form.Select>
          {errors.tipoPromocion && (
            <Form.Text className="text-danger">
              {errors.tipoPromocion}
            </Form.Text>
          )}
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group controlId="descripcionDescuento">
          <Form.Label>Descripción Descuento</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            style={{ resize: "none" }}
            type="text"
            name="descripcionDescuento"
            value={promocion.descripcionDescuento}
            onChange={(e) =>
              handleChange({ descripcionDescuento: e.target.value })
            }
            isInvalid={!!errors.descripcionDescuento}
          />
          {errors.descripcionDescuento && (
            <Form.Text className="text-danger">
              {errors.descripcionDescuento}
            </Form.Text>
          )}
        </Form.Group>
      </Row>
    </FormWrapper>
  );
};
