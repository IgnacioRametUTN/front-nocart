import Form from "react-bootstrap/esm/Form";
import { Promocion } from "../../../entities/DTO/Promocion/Promocion";
import InputGroup from "react-bootstrap/esm/InputGroup";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Articulo } from "../../../entities/DTO/Articulo/Articulo";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import { FormWrapper } from "../../../components/generic/FormWrapper";

interface Props {
  promocion: Promocion;
  handleChange: (field: Partial<Promocion>) => void;
  availableArticulos: Articulo[];
  errors: {
    precioPromocional?: string;
    promocionDetalles?: string;
  };
}
export const PromocionItems = ({
  promocion,
  availableArticulos,
  handleChange,
  errors,
}: Props) => {
  const handleArticuloSelect = (articulo: Articulo) => {
    if (
      !promocion.detallesPromocion.find((d) => d.articulo.id === articulo.id)
    ) {
      handleChange({
        detallesPromocion: [
          ...promocion.detallesPromocion,
          { cantidad: 1, articulo: articulo, id: 0, alta: true },
        ],
      });
    }
  };

  const handleArticuloRemove = (articuloId: number) => {
    handleChange({
      detallesPromocion: promocion.detallesPromocion.filter(
        (d) => d.articulo.id !== articuloId
      ),
    });
  };

  const handleCantidadChange = (articuloId: number, cantidad: number) => {
    handleChange({
      detallesPromocion: promocion.detallesPromocion.map((d) =>
        d.articulo.id === articuloId ? { ...d, cantidad } : d
      ),
    });
  };
  return (
    <FormWrapper title="Productos de la promocion">
      <Form.Group className="mb-3" controlId="precioPromocional">
        <Form.Label>Precio Promocional</Form.Label>
        <InputGroup>
          <InputGroup.Text>$</InputGroup.Text>
          <Form.Control
            type="number"
            name="precioPromocional"
            value={promocion.precioPromocional}
            onChange={(e) =>
              handleChange({ precioPromocional: Number(e.target.value) })
            }
          />
        </InputGroup>
        {errors.precioPromocional && (
          <Form.Text className="text-danger">
            {errors.precioPromocional}
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Artículos en Promoción</Form.Label>
        <ListGroup>
          {availableArticulos.map((articulo) => (
            <ListGroup.Item
              className="d-flex justify-content-between pe-5"
              key={articulo.id}
              onClick={(e) => {
                e.preventDefault();
                handleArticuloSelect(articulo);
              }}
              variant={
                promocion.detallesPromocion.some(
                  (d) => d.articulo.id === articulo.id
                )
                  ? "success"
                  : undefined
              }
            >
              {articulo.denominacion}
              <span>Precio Venta: ${articulo.precioVenta}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Form.Group>

      {promocion.detallesPromocion && promocion.detallesPromocion.length > 0 ? (
        <>
          <h5>Detalles de Promoción</h5>
          <ListGroup>
            {promocion.detallesPromocion.map((detalle) => (
              <ListGroup.Item key={detalle.articulo.id}>
                <Row>
                  <Col>
                    <label htmlFor={`cantidad-${detalle.articulo.id}`}>
                      {detalle.articulo.denominacion}
                    </label>
                  </Col>
                  <Col>
                    <Form.Control
                      id={`cantidad-${detalle.articulo.id}`}
                      type="number"
                      value={detalle.cantidad}
                      onChange={(e) =>
                        handleCantidadChange(
                          detalle.articulo.id,
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => handleArticuloRemove(detalle.articulo.id)}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <p>No hay detalles cargados</p>
      )}
      {errors.promocionDetalles && (
        <p className="text-danger">{errors.promocionDetalles}</p>
      )}

      {errors.precioPromocional && (
        <p className="text-danger">{errors.precioPromocional}</p>
      )}
    </FormWrapper>
  );
};
