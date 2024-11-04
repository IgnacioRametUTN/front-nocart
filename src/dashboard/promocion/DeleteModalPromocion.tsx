import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";

type PromModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  promo: Promocion;
  handleDelete : (id: number) => void;
};

export default function DeleteModalPromocion({
  show,
  onHide,
  title,
  promo,
  handleDelete

}: PromModalProps) {
    const [loading, setLoading] = useState(false);
  return (
    <>
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {promo.alta ? "¿Esta seguro que desea eliminar la promocion?" : "¿Esta seguro que desea dar de alta la promocion?"}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                Cancelar
                </Button>
                {loading ? (
                            <Button variant={promo.alta ? "danger" : "success"} disabled>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> {promo.alta ? "Dando de Baja..." : "Dando de Alta..."}
                            </Button>
                        ) : (
                            <Button variant={promo.alta ? "danger" : "success"} onClick={async () => {
                                setLoading(true); // Activar indicador de carga
                                try {
                                    await handleDelete(promo.id);
                                    onHide(); // Ocultar el modal después de eliminar
                                } catch (error) {
                                    console.error("Error al dar de baja/alta el artículo insumo:", error);
                                } finally {
                                    setLoading(false);
                                }
                            }}>
                                {promo.alta ? "Dar de Baja" : "Dar de Alta"}
                            </Button>
                        )}
            </Modal.Footer>
        </Modal>
    </>
  );
}