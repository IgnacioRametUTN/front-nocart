import { FormWrapper } from "../../../../components/generic/FormWrapper";
import Form from "react-bootstrap/esm/Form";
import { ArticuloManufacturado } from "../../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import Row from "react-bootstrap/esm/Row";

interface Props {
  articuloManufacturado: ArticuloManufacturado;
  handleChange: (field: Partial<ArticuloManufacturado>) => void;
  errors: {
    denominacion?: string;
    descripcion?: string;
    preparacion?: string;
    tiempoEstimadoMinutos?: string;
  };
}

export const ArtMGeneralData = ({
  articuloManufacturado,
  handleChange,
  errors,
}: Props) => {
  return (
    <FormWrapper title="Informacion General">
      <div>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pizza..."
              value={articuloManufacturado.denominacion}
              onChange={(e) => handleChange({ denominacion: e.target.value })}
              isInvalid={!!errors.denominacion}
            />
            {errors.denominacion && (
              <Form.Text className="text-danger">
                {errors.denominacion}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tiempo de Preparacion</Form.Label>
            <Form.Control
              type="number"
              min={0}
              placeholder="Pizza..."
              value={articuloManufacturado.tiempoEstimadoMinutos}
              onChange={(e) =>
                handleChange({ tiempoEstimadoMinutos: Number(e.target.value) })
              }
              isInvalid={!!errors.tiempoEstimadoMinutos}
            />
            {errors.tiempoEstimadoMinutos && (
              <Form.Text className="text-danger">
                {errors.tiempoEstimadoMinutos}
              </Form.Text>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Masa al horno de barro con queso de la mejor calidad..."
              value={articuloManufacturado.descripcion}
              onChange={(e) => handleChange({ descripcion: e.target.value })}
              isInvalid={!!errors.descripcion}
              style={{ resize: "none" }}
            />
            {errors.descripcion && (
              <Form.Text className="text-danger">
                {errors.descripcion}
              </Form.Text>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Preparación</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Paso 1: prender el horno..."
              value={articuloManufacturado.preparacion}
              onChange={(e) => handleChange({ preparacion: e.target.value })}
              isInvalid={!!errors.preparacion}
              style={{ resize: "none" }} 
            />
            {errors.preparacion && (
              <Form.Text className="text-danger">
                {errors.preparacion}
              </Form.Text>
            )}
          </Form.Group>
        </Row>
      </div>
    </FormWrapper>
  );
};
