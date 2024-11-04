import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Categoria } from "../../entities/DTO/Categoria/Categoria";
import { CategoriaService } from "../../services/CategoriaService";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { useSnackbar } from "../../hooks/SnackBarProvider";

interface ModalProps {
  show: boolean;
  onHide: () => void;
  idpadre: string;
  editMode: boolean;
  selectedCategoria: Categoria;
  sucursales: Sucursal[];
}

const CategoriaModal = ({
  show,
  onHide,
  idpadre,
  editMode,
  selectedCategoria,
  sucursales,
}: ModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showError, showSuccess } = useSnackbar();
  const [categoria, setCategoria] = useState<Categoria>(selectedCategoria);
  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState<boolean>(false);
  const [categoriaExistente, setCategoriaExistente] =
    useState<Categoria | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>(
    selectedCategoria.sucursales
      ? selectedCategoria.sucursales.map((sucursal: Sucursal) => sucursal.id)
      : []
  );
  useAuth0Extended();

  const resetForm = () => {
    setCategoria(new Categoria());
    setFiles([]);
    setSelectedSucursales([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!categoria.denominacion?.trim()) {
        throw new Error("La denominación es requerida");
      }

      const categoriaRequest = {
        categoria: {
          ...categoria,
          alta: true,
          sucursales: selectedCategoria.sucursales,
        },
        sucursalesIds: selectedSucursales,
      };
      let categoriaExistenteResponse =
        editMode || categoriaExistente
          ? null
          : await CategoriaService.validateCategoria(categoria.denominacion);
      if (categoriaExistenteResponse) {
        setCategoriaExistente(categoriaExistenteResponse);
        setMostrarConfirmacion(true);
      } else {
        if (selectedSucursales.length === 0) {
          throw new Error("Debe seleccionar al menos una sucursal");
        }
        await saveCategoria(categoriaRequest);
      }
      showSuccess("Categoría guardada exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveCategoria = async (categoriaRequest: any) => {
    let data;
    if (editMode || categoria.id !== 0) {

      data = await CategoriaService.actualizarCategoria(
        categoria.id,
        categoriaRequest
      );
    } else {
      const idPadreAsNumber = Number(idpadre);
      data = await CategoriaService.agregarCategoria(
        idPadreAsNumber,
        categoriaRequest
      );
    }

    if (data && files.length > 0) {
      await CategoriaService.uploadFiles(data.id, files);
    }

    resetForm();
    onHide();
  };

  const handleImagenesChange = (newImages: any[]) => {
    setCategoria((prev) => ({ ...prev, imagenes: newImages }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSucursalChange = (id: number) => {
    setSelectedSucursales((prev) =>
      prev.includes(id)
        ? prev.filter((sucursalId) => sucursalId !== id)
        : [...prev, id]
    );
  };

  const handleUsarExistente = (categoriaExistente: Categoria) => {
    setCategoria(categoriaExistente);
    setSelectedSucursales(
      categoriaExistente.sucursales.map((sucursal: Sucursal) => sucursal.id)
    );
    setMostrarConfirmacion(false); // Cerrar el modal de confirmación
  };

  useEffect(() => {
    if (categoriaExistente) {

      setCategoria(categoriaExistente);
    }
  }, [categoriaExistente]);
  const handleConfirmacion = async (usarExistente: boolean) => {
    if (usarExistente && categoriaExistente) {
      setCategoria(categoriaExistente);
      handleUsarExistente(categoriaExistente);
    } else {
      resetForm();
    }
    setMostrarConfirmacion(false);
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => {
          resetForm();
          onHide();
        }}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Editar Categoría" : "Crear Categoría"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="denominacion">
              <Form.Label>Denominación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresar Denominación"
                onChange={(e) => {
                  setCategoriaExistente(null);
                  setCategoria({ ...categoria, denominacion: e.target.value });
                }}
                value={categoria.denominacion || ""}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="sucursales">
              <Form.Label>Sucursales</Form.Label>
              {sucursales.map((sucursal: Sucursal) => (
                <Form.Check
                  key={sucursal.id}
                  type="checkbox"
                  id={String(sucursal.id)}
                  label={sucursal.nombre}
                  checked={selectedSucursales.includes(sucursal.id)}
                  onChange={() => handleSucursalChange(sucursal.id)}
                  disabled={isLoading}
                />
              ))}
            </Form.Group>

            <ImagenCarousel
              imagenesExistentes={categoria.imagenes}
              onFilesChange={handleFileChange}
              onImagenesChange={handleImagenesChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => onHide()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleSave}>
            {isLoading ? "Guardando..." : editMode ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={mostrarConfirmacion}
        onHide={() => setMostrarConfirmacion(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Categoría existente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ya existe una categoría con el mismo nombre. ¿Desea usar la categoría
          existente o crear una nueva?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleConfirmacion(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleConfirmacion(true)}>
            Usar existente
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoriaModal;
