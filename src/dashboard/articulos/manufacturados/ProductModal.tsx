import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { ArticuloManufacturado } from "../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";

type ProductModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  product: ArticuloManufacturado;
  handleDelete: (id: number) => void;
};

export default function ProductModal({
  show,
  onHide,
  title,
  product,
  handleDelete,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Modal show={show} onHide={onHide} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product.alta
            ? "¿Esta seguro que desea eliminar el producto?"
            : "¿Esta seguro que desea dar de alta el producto?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          {loading ? (
            <Button variant={product.alta ? "danger" : "success"} disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              {product.alta ? "Dando de Baja..." : "Dando de Alta..."}
            </Button>
          ) : (
            <Button
              variant={product.alta ? "danger" : "success"}
              onClick={async () => {
                setLoading(true); // Activar indicador de carga
                try {
                  await handleDelete(product.id);
                  onHide(); // Ocultar el modal después de eliminar
                } catch (error) {
                  console.error(
                    "Error al dar de baja/alta el artículo insumo:",
                    error
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {product.alta ? "Dar de Baja" : "Dar de Alta"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
