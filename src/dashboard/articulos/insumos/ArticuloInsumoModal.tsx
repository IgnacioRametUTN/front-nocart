import { useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { ModalType } from "../../../components/enums/ModalType";
import { ArticuloInsumo } from "../../../entities/DTO/Articulo/Insumo/ArticuloInsumo";
import { UnidadMedida } from "../../../entities/DTO/UnidadMedida/UnidadMedida";
import { Categoria } from "../../../entities/DTO/Categoria/Categoria";
import ImagenCarousel from "../../../components/generic/carousel/ImagenCarousel";
import { Imagen } from "../../../entities/DTO/Imagen";
import { useSnackbar } from "../../../hooks/SnackBarProvider";

interface ArticuloInsumoModalProps {
  articulo: ArticuloInsumo | undefined;
  modalType: ModalType;
  titulo: string;
  unidadesMedida: UnidadMedida[];
  categorias: Categoria[];
  onHide: () => void;
  handleSubmit: (art: ArticuloInsumo, files: File[]) => Promise<void>;
  handleDelete: (idArt: number) => Promise<void>;
}

const ArticuloInsumoModal = ({
  onHide,
  modalType,
  articulo,
  titulo,
  handleSubmit,
  handleDelete,
  unidadesMedida,
  categorias,
}: ArticuloInsumoModalProps) => {
  const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(
    articulo ? articulo : new ArticuloInsumo()
  );
  const [error, setError] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  const handleChange = (name: string, value: string | number | boolean) => { 
    setArticuloInsumo((prev) => {
      const updatedArticulo = { ...prev };
  
      if (name === "categoria") {
        const categoriaSeleccionada = categorias.find(
          (c) => c.id === parseInt(value.toString())
        );
        if (categoriaSeleccionada) {
          updatedArticulo.categoria = categoriaSeleccionada; // Ensure it’s not null
        }
      } else if (name === "unidadMedida") {
        const unidadSeleccionada = unidadesMedida.find(
          (um) => um.id === parseInt(value.toString())
        );
        updatedArticulo.unidadMedida = unidadSeleccionada || null;
      } else {
        (updatedArticulo as any)[name] = value;
      }
  
      return updatedArticulo;
    });
  };
  

  const handleBlur = (name: keyof ArticuloInsumo) => {
    setArticuloInsumo((prev) => {
      const value = prev[name];
      if (typeof value === "number") {
        return {
          ...prev,
          [name]: parseFloat(value.toFixed(2)),
        };
      }
      return prev;
    });
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setArticuloInsumo((prev) => ({
      ...prev,
      imagenes: newImages,
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const validarFormulario = (): boolean => {
    if (!articuloInsumo.denominacion || !articuloInsumo.denominacion.trim()) {
      setError("La denominación es obligatoria.");
      return false;
    }
    if (articuloInsumo.unidadMedida === null) {
      setError("La unidad de medida es obligatoria.");
      return false;
    }
    if (articuloInsumo.categoria === null) {
      setError("La categoría es obligatoria.");
      return false;
    }
    if (articuloInsumo.precioCompra <= 0) {
      setError("El precio de compra no puede ser 0 o negativo.");
      return false;
    }
    if (articuloInsumo.precioVenta <= 0) {
      setError("El precio de venta debe ser mayor o igual que 0.");
      return false;
    }
    if (articuloInsumo.stockActual < 0) {
      setError("El stock actual no puede ser negativo.");
      return false;
    }
    if (articuloInsumo.stockActual > articuloInsumo.stockMaximo) {
      setError("No puedes tener mas stock del permitido");
      return false;
    }
    if (articuloInsumo.stockMaximo <= 0) {
      setError("El stock máximo debe ser mayor o igual que 0.");
      return false;
    }

    setError("");
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validarFormulario()) {
      setLoading(true); // Activar indicador de carga
      try {
        await handleSubmit(articuloInsumo, files);
        onHide(); // Ocultar el modal después de guardar
        showSuccess("Artículo guardado exitosamente");
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteButtonClick = async () => {
    setLoading(true); // Activar indicador de carga
    try {
      await handleDelete(articuloInsumo.id);
      onHide(); // Ocultar el modal después de eliminar
      showSuccess("Estado cambiado exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal show={true} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro de que desea dar de{" "}
              {articuloInsumo.alta ? "baja" : "alta"} el ingrediente?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            {loading ? (
              <Button
                variant={articuloInsumo.alta ? "danger" : "success"}
                disabled
              >
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                {articuloInsumo.alta ? "Dando de Baja..." : "Dando de Alta..."}
              </Button>
            ) : (
              <Button
                variant={articuloInsumo.alta ? "danger" : "success"}
                onClick={handleDeleteButtonClick}
              >
                {articuloInsumo.alta ? "Dar de Baja" : "Dar de Alta"}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          show={true}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-xl"
        >
          <Modal.Header>
            <Modal.Title>{titulo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form autoComplete="off" onSubmit={handleFormSubmit}>
              <Row>
                <Form.Group as={Col} controlId="formDenominacion">
                  <Form.Label>Denominación</Form.Label>
                  <Form.Control
                    name="denominacion"
                    type="text"
                    value={articuloInsumo?.denominacion}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, value)
                    }
                    placeholder="Harina.."
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formUnidadMedida">
                  <Form.Label>Unidad de Medida</Form.Label>
                  <Form.Select
                    name="unidadMedida"
                    value={articuloInsumo?.unidadMedida?.id}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, parseInt(value))
                    }
                  >
                    <option value="0">Selecciona una unidad de medida</option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formCategoria">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={articuloInsumo?.categoria?.id}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, parseInt(value))
                    }
                  >
                    <option value="0">Selecciona una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} controlId="formPrecioCompra">
                  <Form.Label>Precio de Compra</Form.Label>
                  <Form.Control
                    name="precioCompra"
                    type="number"
                    value={articuloInsumo?.precioCompra}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, Number(value))
                    }
                    min={0}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formPrecioVenta">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    name="precioVenta"
                    type="number"
                    value={articuloInsumo?.precioVenta}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, Number(value))
                    }
                    min={0}
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} controlId="formStockActual">
                  <Form.Label>Stock Actual</Form.Label>
                  <Form.Control
                    name="stockActual"
                    type="number"
                    value={articuloInsumo?.stockActual}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, Number(value))
                    }
                    onBlur={({ target: { name } }) =>
                      handleBlur(name as keyof ArticuloInsumo)
                    }
                    min={0}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formStockMaximo">
                  <Form.Label>Stock Máximo</Form.Label>
                  <Form.Control
                    name="stockMaximo"
                    type="number"
                    value={articuloInsumo?.stockMaximo}
                    onChange={({ target: { name, value } }) =>
                      handleChange(name, Number(value))
                    }
                    onBlur={({ target: { name } }) =>
                      handleBlur(name as keyof ArticuloInsumo)
                    }
                    min={0}
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} controlId="formAlta">
                  <Form.Check
                    name="alta"
                    type="checkbox"
                    label="Dar de alta"
                    checked={articuloInsumo?.alta}
                    onChange={({ target: { name, checked } }) =>
                      handleChange(name, checked)
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formElaborar">
                  <Form.Check
                    name="esParaElaborar"
                    type="checkbox"
                    label="Es para elaborar"
                    checked={articuloInsumo?.esParaElaborar}
                    onChange={({ target: { name, checked } }) =>
                      handleChange(name, checked)
                    }
                  />
                </Form.Group>
              </Row>

              <Row>
                <Col>
                  <ImagenCarousel
                    imagenesExistentes={articuloInsumo?.imagenes || []}
                    onFilesChange={handleFileChange}
                    onImagenesChange={handleImagenesChange}
                  />
                </Col>
              </Row>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                  Cancelar
                </Button>
                {loading ? (
                  <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Guardando...
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Guardar
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ArticuloInsumoModal;
