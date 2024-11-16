import { FormEvent, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import { Categoria } from "../../../entities/DTO/Categoria/Categoria";
import { UnidadMedida } from "../../../entities/DTO/UnidadMedida/UnidadMedida";
import Button from "react-bootstrap/esm/Button";
import { ArticuloManufacturado } from "../../../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import Form from "react-bootstrap/esm/Form";
import { ArtMPricingAndCategories } from "./form/ArtMPricingAndCategories";
import { ArtMGeneralData } from "./form/ArtMGeneralData";
import { useMultistepForm } from "../../../hooks/useMultistepForm";
import ImagenCarousel from "../../../components/generic/carousel/ImagenCarousel";
import { Imagen } from "../../../entities/DTO/Imagen";
import { ArtMDetails } from "./form/ArtMDetails";
import { Spinner } from "react-bootstrap";
import { useSnackbar } from "../../../hooks/SnackBarProvider";

interface Props {
  categorias: Categoria[];
  unidadesMedida: UnidadMedida[];
  readOnly: boolean;
  articuloManufacturado: ArticuloManufacturado;
  onHide: () => void;
  handleSubmit: (
    articuloManufacturado: ArticuloManufacturado,
    files: File[]
  ) => Promise<void>;
}
export const ArticuloManufacturadoModal = ({
  categorias,
  unidadesMedida,

  articuloManufacturado,
  onHide,
  handleSubmit,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [artManufacturado, setArtManufacturado] =
    useState<ArticuloManufacturado>(articuloManufacturado);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ArticuloManufacturado, string>>
  >({});
  const [files, setFiles] = useState<File[]>([]);
  const { showError, showSuccess } = useSnackbar();

  const handleChange = (field: Partial<ArticuloManufacturado>) => {
    setArtManufacturado((prev) => ({
      ...prev,
      ...field,
    }));
    const fieldName = Object.keys(field)[0] as keyof ArticuloManufacturado;
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const handleCantidadChange = (index: number, newCantidad: number) => {
    setArtManufacturado((prev) => {
      const updatedDetalles = [...prev.articuloManufacturadoDetalles];
      const detalle = updatedDetalles[index];
      if (detalle) {
        updatedDetalles[index] = {
          ...detalle,
          cantidad: newCantidad,
        };
      }
      return {
        ...prev,
        articuloManufacturadoDetalles: updatedDetalles,
      };
    });
  };

  const validateFields = () => {
    const newErrors: {
      denominacion?: string;
      descripcion?: string;
      preparacion?: string;
      precioVenta?: string;
      tiempoEstimadoMinutos?: string;
      categoria?: string;
      unidadMedida?: string;
      articuloManufacturadoDetalles?: string;
    } = {};

    if (currentStepIndex === 0) {
      if (!artManufacturado.denominacion) {
        newErrors.denominacion = "La denominación es requerida";
      }

      if (!artManufacturado.descripcion) {
        newErrors.descripcion = "La descripción es requerida";
      }

      if (
        !artManufacturado.tiempoEstimadoMinutos &&
        artManufacturado.tiempoEstimadoMinutos <= 0
      ) {
        newErrors.tiempoEstimadoMinutos =
          "El tiempo debe ser un valor positivo";
      }

      if (!artManufacturado.preparacion) {
        newErrors.preparacion = "La preparación es requerida";
      }
    }

    if (currentStepIndex === 1) {
      if (!artManufacturado.precioVenta && artManufacturado.precioVenta < 0) {
        newErrors.precioVenta = "El precio de venta debe ser un valor válido";
      }

      if (!artManufacturado.categoria) {
        newErrors.categoria = "Debes seleccionar una categoria";
      }

      if (!artManufacturado.unidadMedida) {
        newErrors.unidadMedida = "Debes seleccionar una unidad de medida";
      }
    }
    if (currentStepIndex === 2) {
      if (artManufacturado.articuloManufacturadoDetalles.length === 0) {
        newErrors.articuloManufacturadoDetalles =
          "Debes cargar articulos insumos";
      }

      if (
        artManufacturado.articuloManufacturadoDetalles.find(
          (art) => art.cantidad === 0
        )
      ) {
        newErrors.articuloManufacturadoDetalles =
          "Debes cargarle una cantidad valida al articulo insumos";
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setArtManufacturado((prev) => {
      return {
        ...prev,
        imagenes: newImages,
      };
    });
  };

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <ArtMGeneralData
        articuloManufacturado={artManufacturado}
        handleChange={handleChange}
        errors={errors}
      />,
      <ArtMPricingAndCategories
        articuloManufacturado={artManufacturado}
        handleChange={handleChange}
        categorias={categorias}
        unidadesMedida={unidadesMedida}
        errors={errors}
      />,
      <ArtMDetails
        categorias={categorias}
        errors={errors}
        unidadesMedida={unidadesMedida}
        detalles={artManufacturado.articuloManufacturadoDetalles}
        onCantidadChange={handleCantidadChange}
        onAddInsumo={handleChange}
      />,
      <ImagenCarousel
        imagenesExistentes={artManufacturado.imagenes}
        onFilesChange={handleFileChange}
        onImagenesChange={handleImagenesChange}
      />,
    ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep && validateFields()) return next();
  }

  async function save() {
    if (validateFields()) {
      setIsLoading(true);

      try {
        await handleSubmit(artManufacturado, files);
        artManufacturado.categoria.subCategorias=[]
        onHide();
        showSuccess("Articulo guardado exitosamente");
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }
  return (
    <Modal show={true} size="lg" backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Formulario de Articulo Manufacturado</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <div style={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
            {currentStepIndex + 1} / {steps.length}
          </div>
          {step}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: ".5rem",
              justifyContent: "flex-end",
            }}
          >
            {!isFirstStep && (
              <Button type="button" variant="secondary" onClick={back}>
                Atras
              </Button>
            )}
            {!isLastStep && <Button type="submit">Siguiente</Button>}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Cerrar
        </Button>
        {isLastStep && (
          <Button
            variant="primary"
            type="button"
            onClick={save}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
