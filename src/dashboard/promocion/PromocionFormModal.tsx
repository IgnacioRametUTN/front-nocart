import { FormEvent, useEffect, useState } from "react";
import { Promocion } from "../../entities/DTO/Promocion/Promocion";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { PromocionDetails } from "./form/PromocionDetails";
import { PromocionValidity } from "./form/PromocionValidity";
import { PromocionItems } from "./form/PromocionItems";
import { useMultistepForm } from "../../hooks/useMultistepForm";
import { Imagen } from "../../entities/DTO/Imagen";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/esm/Form";
import Spinner from "react-bootstrap/esm/Spinner";
import { Articulo } from "../../entities/DTO/Articulo/Articulo";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { ProductServices } from "../../services/ProductServices";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import { useSnackbar } from "../../hooks/SnackBarProvider";
interface PromocionModalProps {
  promocion: Promocion;
  handleSubmit: (promocion: Promocion, files: File[]) => Promise<void>;
  onHide: () => void;
}
export const PromocionFormModal = ({
  promocion,
  handleSubmit,
  onHide,
}: PromocionModalProps) => {
  const { activeSucursal } = useAuth0Extended();
  const [currentPromocion, setCurrentPromcion] = useState<Promocion>(promocion);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Promocion, string>>
  >({});
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableArticulos, setAvailableArticulos] = useState<Articulo[]>([]);
  const {showError, showSuccess} = useSnackbar();

  const fetchArticulos = async () => {
    try {
      const manufacturados = await ProductServices.getAllFiltered(
        activeSucursal
      );
      const insumosNoElaborados =
        await ArticuloInsumoService.obtenerArticulosInsumosFiltrados(
          activeSucursal
        );
      setAvailableArticulos([
        ...manufacturados,
        ...insumosNoElaborados.filter((a) => !a.esParaElaborar),
      ]);
    } catch (error) {
      console.error("Error al obtener los articulos manufacturados", error);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, [activeSucursal]);

  const handleChange = (field: Partial<Promocion>) => {
    setCurrentPromcion((prev) => ({
      ...prev,
      ...field,
    }));
    const fieldName = Object.keys(field)[0] as keyof Promocion;
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };
  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setCurrentPromcion((prev) => {
      return {
        ...prev,
        imagenes: newImages,
      };
    });
  };

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <PromocionDetails
        promocion={currentPromocion}
        handleChange={handleChange}
        errors={errors}
      />,
      <PromocionValidity
        promocion={currentPromocion}
        handleChange={handleChange}
        errors={errors}
      />,
      <PromocionItems
        promocion={currentPromocion}
        handleChange={handleChange}
        errors={errors}
        availableArticulos={availableArticulos}
      />,
      <ImagenCarousel
        imagenesExistentes={currentPromocion.imagenes}
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
        await handleSubmit(currentPromocion, files);
        onHide();
        showSuccess("Sucursal guardada exitosamente");
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  interface ValidationErrors {
    denominacion?: string;
    descripcionDescuento?: string;
    tipoPromocion?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    horaDesde?: string;
    horaHasta?: string;
    validez?: string;
    promocionDetalles?: string;
    precioPromocional?: string;
  }

  const isEmpty = (value: any): boolean => value == null || value === "";

  const validateDateTime = (
    fechaDesde: Date,
    fechaHasta: Date,
    horaDesde: string,
    horaHasta: string
  ): boolean => {
    const fechaHoraDesde = new Date(fechaDesde);
    const fechaHoraHasta = new Date(fechaHasta);

    if (horaDesde && horaHasta) {
      const [horaDesdeNum, minutosDesde] = horaDesde.split(":").map(Number);
      const [horaHastaNum, minutosHasta] = horaHasta.split(":").map(Number);
      fechaHoraDesde.setHours(horaDesdeNum, minutosDesde);
      fechaHoraHasta.setHours(horaHastaNum, minutosHasta);
    }

    return fechaHoraDesde <= fechaHoraHasta;
  };

  const validateFields = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (currentStepIndex === 0) {
      if (isEmpty(currentPromocion.denominacion)) {
        newErrors.denominacion = "La denominación es requerida";
      }

      if (isEmpty(currentPromocion.descripcionDescuento)) {
        newErrors.descripcionDescuento = "La descripción es requerida";
      }

      if (isEmpty(currentPromocion.tipoPromocion)) {
        newErrors.tipoPromocion = "Debe seleccionar un tipo de promoción";
      }
    }

    if (currentStepIndex === 1) {
      if (isEmpty(currentPromocion.fechaDesde)) {
        newErrors.fechaDesde = "La fecha desde es requerida";
      }
      if (isEmpty(currentPromocion.fechaHasta)) {
        newErrors.fechaHasta = "La fecha hasta es requerida";
      }
      if (isEmpty(currentPromocion.horaDesde)) {
        newErrors.horaDesde = "La hora desde es requerida";
      }
      if (isEmpty(currentPromocion.horaHasta)) {
        newErrors.horaHasta = "La hora hasta es requerida";
      }

      if (
        currentPromocion.fechaDesde &&
        currentPromocion.fechaHasta &&
        currentPromocion.horaDesde &&
        currentPromocion.horaHasta &&
        !validateDateTime(
          currentPromocion.fechaDesde,
          currentPromocion.fechaHasta,
          currentPromocion.horaDesde,
          currentPromocion.horaHasta
        )
      ) {
        newErrors.validez =
          "La fecha y hora de inicio deben ser anteriores a la fecha y hora de finalización.";
      }
    }

    if (currentStepIndex === 2) {
      if (currentPromocion.detallesPromocion.length === 0) {
        newErrors.promocionDetalles = "Debes cargar artículos";
      }

      const invalidCantidad = currentPromocion.detallesPromocion.some(
        (detalle) => detalle.cantidad <= 0
      );
      if (invalidCantidad) {
        newErrors.promocionDetalles =
          "Debes cargarle una cantidad válida al artículo";
      }

      if (currentPromocion.precioPromocional < 0) {
        newErrors.precioPromocional = "El precio promocional no es válido";
      }

      const precioPromocion = currentPromocion.detallesPromocion.reduce(
        (total, detalle) =>
          total + detalle.cantidad * detalle.articulo.precioVenta,
        0
      );

      if (
        currentPromocion.precioPromocional >= precioPromocion &&
        !newErrors.promocionDetalles
      ) {
        newErrors.promocionDetalles =
          "El precio total de los artículos es menor o igual al precio promocional.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
