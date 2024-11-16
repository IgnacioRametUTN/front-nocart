import { FormWrapper } from "../../../../components/generic/FormWrapper";
import Form from "react-bootstrap/esm/Form";
import { ArticuloManufacturado } from "../../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import Row from "react-bootstrap/esm/Row";
import { Categoria } from "../../../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../../../entities/DTO/UnidadMedida/UnidadMedida";

interface Props {
  articuloManufacturado: ArticuloManufacturado;
  handleChange: (field: Partial<ArticuloManufacturado>) => void;
  categorias: Categoria[];
  unidadesMedida: UnidadMedida[];
  errors: {
    precioVenta?: string;
    categoria?: string;
    unidadMedida?: string;
  };
}

export const ArtMPricingAndCategories = ({
  articuloManufacturado,
  handleChange,
  categorias,
  unidadesMedida,
  errors,
}: Props) => {
  return (
    <FormWrapper title="Precio Y Categorias">
      <div>
        <Row>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              type="number"
              placeholder="500"
              value={articuloManufacturado.precioVenta}
              onChange={(e) =>
                handleChange({ precioVenta: Number(e.target.value) })
              }
              isInvalid={!!errors.precioVenta}
              min={0}
            />
            {errors.precioVenta && (
              <Form.Text className="text-danger">
                {errors.precioVenta}
              </Form.Text>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="formCategorySelect">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={articuloManufacturado.categoria?.id}
              onChange={(e) => 
                handleChange({
                  categoria:
                    categorias.find(
                      (cat) => cat.id === Number(e.target.value)
                    ) || undefined, // Use undefined instead of null
                })
              }
              
              isInvalid={!!errors.categoria}
            >
              <option value="">Seleccione una categoría...</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.denominacion}
                </option>
              ))}
            </Form.Select>
            {errors.categoria && (
              <Form.Text className="text-danger">{errors.categoria}</Form.Text>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="formCategorySelect">
            <Form.Label>Unidad Medida</Form.Label>
            <Form.Select
              value={articuloManufacturado.unidadMedida?.id || ""}
              onChange={(e) =>
                handleChange({
                  unidadMedida:
                    unidadesMedida.find(
                      (cat) => cat.id === Number(e.target.value)
                    ) || null,
                })
              }
              isInvalid={!!errors.unidadMedida}
            >
              <option value="">Seleccione una categoría...</option>
              {unidadesMedida.map((unidadMedida) => (
                <option key={unidadMedida.id} value={unidadMedida.id}>
                  {unidadMedida.denominacion}
                </option>
              ))}
            </Form.Select>
            {errors.unidadMedida && (
              <Form.Text className="text-danger">
                {errors.unidadMedida}
              </Form.Text>
            )}
          </Form.Group>
        </Row>
      </div>
    </FormWrapper>
  );
};
