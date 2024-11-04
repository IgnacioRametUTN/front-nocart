import React, { useState } from "react";
import Usuario from "../../entities/DTO/Usuario/Usuario";
import { Cliente } from "../../entities/DTO/Cliente/Cliente";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormularioDomicilio from "../../components/shared/form-domicilio/FormDomicilio";
import ImagenCarousel from "../../components/generic/carousel/ImagenCarousel";
import { Domicilio } from "../../entities/DTO/Domicilio/Domicilio";
import { Imagen } from "../../entities/DTO/Imagen";
import { useAuth0 } from "@auth0/auth0-react"; // Importar useAuth0
import { Rol } from "../../entities/enums/Rol";
import ClienteService from "../../services/ClienteService";

const FormularioCliente = () => {
  const [step, setStep] = useState(1);
  const [ClienteData, setClienteData] = useState<Cliente>(new Cliente());
  const [, setDomicilioData] = useState<Domicilio>(new Domicilio());
  const [selectedRole] = React.useState<Rol>(Rol.Cliente); //Role Inicial
  const [, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const { user, loginWithRedirect } = useAuth0();
  if (!user) {
    loginWithRedirect({
      appState: {
        returnTo: "/",
      },
    });
  }
  const handleSubmitDomicilio = async (domicilio: Domicilio) => {
    if (user && user.email) {
      setDomicilioData(domicilio);
      const usuario = new Usuario();
      usuario.username = user.email.split("@")[0];
      const ClienteCompleto = {
        ...ClienteData,
        alta: true,
        usuario: usuario,
        domicilios: [domicilio],
      };
      ClienteCompleto.usuario.rol = selectedRole;

      try {
        const response = await ClienteService.agregarCliente(ClienteCompleto);
        if (response && response.usuario.rol) {
          setSuccess("Cliente registrado con éxito."); // Set success message
          setTimeout(() => navigate("/"), 1500); // Navigate after success message
        } else {
          setError("Hubo un problema al registrar el Cliente.");
        }
      } catch (error) {
        console.error("Error al crear Cliente:", error);
        setError("Hubo un problema al registrar el Cliente.");
      }
    }
  };

  const handleSubmitCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleChangeCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const year = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();

    if (name === "fechaNacimiento" && (year < 1930 || year > currentYear)) {
      setError(`El año debe estar entre 1930 y ${currentYear}`);
    } else {
      setError("");
      setClienteData({ ...ClienteData, [name]: value });
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleImagenesChange = (newImages: Imagen[]) => {
    setClienteData((prev) => ({
      ...prev,
      imagenes: newImages,
    }));
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <>
      <div className="col-md-9">
        <h1>Formulario de Cliente</h1>
        {step === 1 && (
          <Form onSubmit={handleSubmitCliente}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={ClienteData.nombre || ""}
                onChange={handleChangeCliente}
                placeholder="Ingrese su nombre"
                required
              />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={ClienteData.apellido || ""}
                onChange={handleChangeCliente}
                placeholder="Ingrese su apellido"
                required
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={ClienteData.telefono || ""}
                onChange={handleChangeCliente}
                placeholder="Ingrese su teléfono"
                required
              />
            </Form.Group>
            <Form.Group controlId="formFechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={ClienteData.fechaNacimiento || ""}
                onChange={handleChangeCliente}
                required
              />
            </Form.Group>

            <div className="mt-3 mb-5">
              <ImagenCarousel
                imagenesExistentes={ClienteData.imagenes}
                onFilesChange={handleFileChange}
                onImagenesChange={handleImagenesChange}
              />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Volver
              </Button>
              {loading ? (
                <Button variant="primary" type="submit">
                  Siguiente <Spinner size="sm" />
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Siguiente
                </Button>
              )}
            </div>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mt-3">
                {success}
              </Alert>
            )}
          </Form>
        )}

        {step === 2 && (
          <FormularioDomicilio
            onBack={handleBack}
            onSubmit={handleSubmitDomicilio}
            initialDomicilio={new Domicilio()}
          />
        )}
      </div>
    </>
  );
};

export default FormularioCliente;
