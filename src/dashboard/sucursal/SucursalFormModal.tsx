import { FormEvent, useState } from "react";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import { Imagen } from "../../entities/DTO/Imagen";
import { SucursalDetails } from "./form/SucursalDetails";
import { useMultistepForm } from "../../hooks/useMultistepForm";
import { SucursalDomicilio } from "./form/SucursalDomicilio";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/esm/Form";
import { useSnackbar } from "../../hooks/SnackBarProvider";

export interface ValidationErrors {
  calle?: string;
  numero?: string;
  cp?: string;
  localidad?: string;
  provincia?: string;
}

interface SucursalModalProps {
  sucursal: Sucursal;
  handleSubmit: (sucursal: Sucursal, files: File[]) => Promise<void>;
  onHide: () => void;
}
export const SucursalFormModal = ({
  sucursal,
  handleSubmit,
  onHide,
}: SucursalModalProps) => {
  const [currentSucursal, setCurrentSucursal] = useState<Sucursal>(sucursal);
  const [errors, setErrors] = useState<Partial<Record<keyof Sucursal, string>>>(
    {}
  );
  const { showError, showSuccess } = useSnackbar();
  const [errorsDomicilio] = useState<
    Partial<Record<keyof ValidationErrors, string>>
  >({});
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (field: Partial<Sucursal>) => {
    setCurrentSucursal((prev) => ({
      ...prev,
      ...field,
    }));
    const fieldName = Object.keys(field)[0] as keyof Sucursal;
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
    setCurrentSucursal((prev) => {
      return {
        ...prev,
        imagenes: newImages,
      };
    });
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep && validateFields()) return next();
  }

  async function save() {
    if (validateFields()) {
      setIsLoading(true);

      try {
        await handleSubmit(currentSucursal, files);
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
    nombre?: string;
    horarioApertura?: string;
    horarioCierre?: string;
    validez?: string;
    calle?: string;
    numero?: string;
    cp?: string;
    provincia?: string;
    localidad?: string;
  }

  const isEmpty = (value: any): boolean => value == null || value === "";

  const validateDateTime = (horaDesde: string, horaHasta: string): boolean => {
    const fechaHoraDesde = new Date();
    const fechaHoraHasta = new Date();

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
      if (isEmpty(currentSucursal.nombre)) {
        newErrors.nombre = "El nombre de la sucursal es requerido";
      }
      if (isEmpty(currentSucursal.horarioApertura)) {
        newErrors.horarioApertura = "El horario de apertura es requerido";
      }
      if (isEmpty(currentSucursal.horarioCierre)) {
        newErrors.horarioCierre = "El horario de cierre es requerido";
      }

      if (
        currentSucursal.horarioApertura &&
        currentSucursal.horarioCierre &&
        !validateDateTime(
          currentSucursal.horarioApertura,
          currentSucursal.horarioCierre
        )
      ) {
        newErrors.validez =
          "El horario de apertura debe ser anteriores al horario de cierre.";
      }
    }
    if (currentStepIndex === 1) {
      //domicilio
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <SucursalDetails
        sucursal={currentSucursal}
        handleChange={handleChange}
        errors={errors}
      />,
      <SucursalDomicilio
        domicilio={currentSucursal.domicilio}
        handleChange={(field) =>
          handleChange({
            domicilio: { ...currentSucursal.domicilio, ...field },
          })
        }
        errors={errorsDomicilio}
      />,

      <ImagenCarousel
        imagenesExistentes={currentSucursal.imagenes}
        onFilesChange={handleFileChange}
        onImagenesChange={handleImagenesChange}
      />,
    ]);
  return (
    <Modal show={true} size="lg" backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2>Formulario de Sucursal</h2>
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