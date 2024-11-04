import Table from "react-bootstrap/esm/Table";
import { FormWrapper } from "../../../../components/generic/FormWrapper";
import { ArticuloManufacturadoDetalle } from "../../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturadoDetalle";
import Form from "react-bootstrap/esm/Form";
import { Categoria } from "../../../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../../../entities/DTO/UnidadMedida/UnidadMedida";
import Button from "react-bootstrap/esm/Button";
import { AgregarInsumosModal } from "../AgregarInsumosModal";
import Row from "react-bootstrap/esm/Row";
import { useState } from "react";
import { ArticuloInsumo } from "../../../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { ArticuloManufacturado } from "../../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";

interface Props {
  detalles: ArticuloManufacturadoDetalle[];
  categorias: Categoria[];
  unidadesMedida: UnidadMedida[];
  onCantidadChange: (index: number, newCantidad: number) => void;
  onAddInsumo: (field: Partial<ArticuloManufacturado>) => void;
  errors: {
    articuloManufacturadoDetalles?: string;
  };
}

export const ArtMDetails = ({
  detalles,
  categorias,
  unidadesMedida,
  onCantidadChange,
  onAddInsumo,
  errors,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const handleOpenModal = (newTitle: string) => {
    setTitle(newTitle);
    setShowModal(true);
  };
  const handleCantidadChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCantidad = parseInt(event.target.value, 10);
      if (!isNaN(newCantidad)) {
        onCantidadChange(index, newCantidad);
      }
    };

  function handleSeleccionInsumos(articulosInsumo: ArticuloInsumo[]): void {
    // Crear un mapa para un acceso rápido a los insumos nuevos
    const nuevosInsumosMap = new Map<number, ArticuloInsumo>();
    articulosInsumo.forEach((articulo) => {
      if (articulo.id !== undefined) {
        // Asegúrate de que id no es undefined
        nuevosInsumosMap.set(articulo.id, articulo);
      }
    });

    // Filtrar y actualizar los detalles viejos que están en la nueva lista de insumos
    const detallesActualizados = detalles
      .filter((detalle) => {
        return (
          detalle.articuloInsumo?.id !== undefined &&
          nuevosInsumosMap.has(detalle.articuloInsumo.id)
        );
      })
      .map((detalle) => {
        // Actualiza el insumo del detalle con el nuevo insumo si es necesario
        if (detalle.articuloInsumo?.id !== undefined) {
          detalle.articuloInsumo =
            nuevosInsumosMap.get(detalle.articuloInsumo.id) ||
            detalle.articuloInsumo;
        }
        return detalle;
      });

    // Agregar nuevos detalles para los insumos que no estaban en los detalles viejos
    articulosInsumo.forEach((articulo) => {
      const exists = detallesActualizados.some(
        (detalle) => detalle.articuloInsumo?.id === articulo.id
      );
      if (!exists) {
        const nuevoDetalle = new ArticuloManufacturadoDetalle();
        nuevoDetalle.articuloInsumo = articulo;
        detallesActualizados.push(nuevoDetalle);
      }
    });

    // Actualizar el estado con los nuevos detalles
    onAddInsumo({ articuloManufacturadoDetalles: detallesActualizados });

    setShowModal(false);
  }

  return (
    <FormWrapper title="Articulos Insumos">
      {showModal && (
        <Row>
          <AgregarInsumosModal
            show={showModal}
            onHide={() => setShowModal(false)}
            title={title}
            articulosExistentes={
              detalles
                ? detalles
                    .filter((detalle) => detalle.articuloInsumo !== null)
                    .map((detalle) => detalle.articuloInsumo as ArticuloInsumo)
                : []
            }
            handleSave={handleSeleccionInsumos}
            categorias={categorias}
            unidadesMedida={unidadesMedida}
          />
        </Row>
      )}

      <Button
        className="mb-2"
        variant="primary"
        onClick={() => handleOpenModal("Agregar Insumos")}
      >
        Editar Insumos
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Artículo Insumo</th>
            <th>Precio Compra</th>
            <th>Unidad Medida</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle, index) => (
            <tr key={index}>
              <td>{detalle.articuloInsumo?.denominacion}</td>
              <td>{detalle.articuloInsumo?.precioCompra ?? "N/A"}</td>
              <td>
                {detalle.articuloInsumo?.unidadMedida?.denominacion ?? "N/A"}
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={detalle.cantidad || "0"}
                  onChange={handleCantidadChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {errors.articuloManufacturadoDetalles && (
        <Row className="text-danger">
          {errors.articuloManufacturadoDetalles}
        </Row>
      )}
    </FormWrapper>
  );
};
