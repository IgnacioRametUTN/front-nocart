import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import Spinner from "react-bootstrap/esm/Spinner";
import { Empleado } from "../../entities/DTO/Empleado/Empleado";
import { UsuarioDto } from "../../entities/DTO/Usuario/Usuario";
import { FormEvent, useState } from "react";
import { useSnackbar } from "../../hooks/SnackBarProvider";
import { Imagen } from "../../entities/DTO/Imagen";
import { useMultistepForm } from "../../hooks/useMultistepForm";
import { EmpleadoDetails } from "./form/EmpleadoDetails";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { UsuarioDetails } from "./form/UsuarioDetails";

interface Props {
  empleado: Empleado;
  usuario: UsuarioDto;
  onHide: () => void;
  handleSubmit: (
    empleado: Empleado,
    usuario: UsuarioDto,
    files: File[]
  ) => Promise<void>;
}
export const UsuarioFormModal = ({
  empleado,
  usuario,
  onHide,
  handleSubmit,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentEmpleado, setCurrentEmpleado] = useState<Empleado>(empleado);
  const [currentUsuario, setCurrentUsuario] = useState<UsuarioDto>(usuario);

  const [errorsEmpleado, setErrorsEmpleado] = useState<
    Partial<Record<keyof Empleado, string>>
  >({});

  const [errorsUsuario, setErrorsUsuario] = useState<
    Partial<Record<keyof UsuarioDto, string>>
  >({});
  const [files, setFiles] = useState<File[]>([]);
  const { showError, showSuccess } = useSnackbar();

  const handleChangeEmpleado = (field: Partial<Empleado>) => {
    setCurrentEmpleado((prev) => ({
      ...prev,
      ...field,
    }));
    const fieldName = Object.keys(field)[0] as keyof Empleado;
    if (errorsEmpleado[fieldName]) {
      setErrorsEmpleado((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const handleChangeUsuario = (field: Partial<UsuarioDto>) => {
    setCurrentUsuario((prev) => ({
      ...prev,
      ...field,
    }));
    const fieldName = Object.keys(field)[0] as keyof UsuarioDto;
    if (errorsUsuario[fieldName]) {
      setErrorsUsuario((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const validateFields = () => {
    const newErrorsEmpleado: {
      nombre?: string;
      apellido?: string;
      fechaNacimiento?: string;
      telefono?: string;
    } = {};
    const newErrorsUsuario: {
      email?: string;
      password?: string;
      rol?: string;
    } = {};

    if (currentStepIndex === 0) {
      console.log(empleado.nombre);

      if (!currentEmpleado.nombre) {
        newErrorsEmpleado.nombre = "El nombre es requerido";
      }

      if (!currentEmpleado.apellido) {
        newErrorsEmpleado.apellido = "El apellido es requerido";
      }
      if (!currentEmpleado.fechaNacimiento) {
        newErrorsEmpleado.fechaNacimiento =
          "La fecha de nacimiento es requerida";
      }
      if (!currentEmpleado.telefono) {
        newErrorsEmpleado.telefono = "El telefono es requerido";
      }
    }

    if (currentStepIndex === 1) {
      if (!currentUsuario.email) {
        newErrorsUsuario.email = "El emmail es requerido";
      }

      if (!currentUsuario.password) {
        newErrorsUsuario.password = "La contraseña es requerida";
      }
      if (!/^.{8,}$/.test(currentUsuario.password)) {
        newErrorsUsuario.password =
          "La contraseña debe tener al menos 8 caracteres";
      }

      if (!validatePassword(currentUsuario.password)) {
        newErrorsUsuario.password =
          "La contraseña debe tener al menos 3 caracteres de tipo mayuscula, minuscula, numero ó : !@#$%^&*";
      }

      if (!currentUsuario.rol) {
        newErrorsUsuario.rol = "El rol es requerido";
      }
    }

    setErrorsEmpleado(newErrorsEmpleado);
    setErrorsUsuario(newErrorsUsuario);

    return (
      Object.keys(newErrorsEmpleado).length === 0 &&
      Object.keys(newErrorsUsuario).length === 0
    );
  };

  function validatePassword(password: string): boolean {
    // Minimum length of 8 characters
    const minLengthRegex = /^.{8,}$/;
    if (!minLengthRegex.test(password)) {
      return false;
    }

    // Individual regexes for each type
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*]/;

    // Check each type and count how many are present
    let typesCount = 0;
    if (lowercaseRegex.test(password)) typesCount++;
    if (uppercaseRegex.test(password)) typesCount++;
    if (numberRegex.test(password)) typesCount++;
    if (specialCharRegex.test(password)) typesCount++;
    console.log(typesCount);
    // Password is valid if at least 3 of the 4 types are present
    return typesCount >= 3;
  }

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setCurrentEmpleado((prev) => {
      return {
        ...prev,
        imagenes: newImages,
      };
    });
  };

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <EmpleadoDetails
        empleado={currentEmpleado}
        handleChange={handleChangeEmpleado}
        errors={errorsEmpleado}
      />,
      <UsuarioDetails
        usuario={currentUsuario}
        handleChange={handleChangeUsuario}
        errors={errorsUsuario}
      />,
      <ImagenCarousel
        imagenesExistentes={currentEmpleado.imagenes}
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
        await handleSubmit(currentEmpleado, currentUsuario, files);
        onHide();
        showSuccess("Usuario guardado exitosamente");
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
          <h2>Formulario de Usuario</h2>
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
