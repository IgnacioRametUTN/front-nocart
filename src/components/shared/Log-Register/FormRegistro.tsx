import React, { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Usuario from "../../../entities/DTO/Usuario/Usuario";
import { Cliente } from "../../../entities/DTO/Cliente/Cliente";
import UsuarioService from "../../../services/UsuarioService";
import ClienteService from "../../../services/ClienteService";
import { useAuth } from "../../../Auth/Auth";

import ImagenCarousel from "../../generic/carousel/ImagenCarousel";
import { Imagen } from "../../../entities/DTO/Imagen";
import { Rol } from "../../../entities/enums/Rol";
import { GoogleLogin } from "@react-oauth/google";
import FormularioDomicilio from "../form-domicilio/FormDomicilio";
import { Domicilio } from "../../../entities/DTO/Domicilio/Domicilio";

interface RegistroUsuarioClienteProps {
  closeModal: () => void;
}

const RegistroUsuarioCliente: React.FC<RegistroUsuarioClienteProps> = ({
  closeModal,
}) => {
  const [step, setStep] = useState(1);
  const [usuarioData, setUsuarioData] = useState<Usuario>(new Usuario());
  const [clienteData, setClienteData] = useState<Cliente>(new Cliente());
  const [, setDomicilioData] = useState({});
  const [, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { login, googleRegister } = useAuth();
  const navigate = useNavigate();

  const handleChangeUsuario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioData({ ...usuarioData, [name]: value });
  };

  const handleChangeCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const year = new Date(value).getFullYear();
    const currentYear = new Date().getFullYear();

    if (name === "fechaNacimiento" && (year < 1930 || year > currentYear)) {
      setError(`El año debe estar entre 1930 y ${currentYear}`);
    } else {
      setError("");
      setClienteData({ ...clienteData, [name]: value });
    }
  };

  const handleSubmitUsuario = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsuarioData((prev) => ({
      ...prev,
      rol: Rol.Cliente,
    }));

    if (usuarioData.auth0Id.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    try {
      const data = await UsuarioService.validarExistenciaUsuario(
        usuarioData.username
      );
      if (!data) {
        setLoading(true);
        setError("");
        setTimeout(() => {
          setLoading(false);
          setStep(2);
        }, 1500);
      } else {
        setError("Nombre de usuario ya ocupado");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleSubmitCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleSubmitDomicilio = async (domicilio: Domicilio) => {
    setDomicilioData(domicilio);
    const clienteCompleto = {
      ...clienteData,
      usuario: usuarioData,
      domicilios: [domicilio],
    };

    try {
      const cliente = await ClienteService.agregarCliente(clienteCompleto);
      if (cliente) {
        setSuccess("Registro Exitoso");
        setTimeout(() => {
          navigate("/");
          closeModal(); // Cerrar el modal después de registrar
          login(
            cliente.usuario.email,
            cliente.usuario.username,
            cliente.usuario.rol || Rol.Cliente
          );
        }, 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
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

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleDomicilioSubmit = (domicilio: any) => {
    handleSubmitDomicilio(domicilio);
  };

  return (
    <Modal show onHide={closeModal}>
      <Modal.Body>
        {step === 1 && (
          <Form onSubmit={handleSubmitUsuario}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={usuarioData.email ?? ""}
                onChange={handleChangeUsuario}
                placeholder="Ingrese su email"
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={usuarioData.username ?? ""}
                onChange={handleChangeUsuario}
                placeholder="Ingrese su nombre de usuario"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                name="auth0Id"
                value={usuarioData.auth0Id ?? ""}
                onChange={handleChangeUsuario}
                placeholder="Ingrese su contraseña"
                required
              />
              <Form.Text className="text-muted">
                La contraseña debe tener al menos 4 caracteres.
              </Form.Text>
              <Button
                variant="outline-secondary"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "Ocultar" : "Mostrar"}
              </Button>
            </Form.Group>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const user = await googleRegister(credentialResponse);
                  setUsuarioData(user);
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setStep(2);
                  }, 1500);
                } catch (error) {
                  setLoading(false);
                  if (error instanceof Error) {
                    setError(error.message);
                  }
                }
              }}
              onError={() => {
                setError("Hubo un error con tu login con google");
              }}
            />
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={handleBack}>
                <Link to="/" className="btn btn-secondary">
                  Volver
                </Link>
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
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleSubmitCliente}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={clienteData.nombre ?? ""}
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
                value={clienteData.apellido ?? ""}
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
                value={clienteData.telefono ?? ""}
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
                value={clienteData.fechaNacimiento ?? ""}
                onChange={handleChangeCliente}
                required
              />
            </Form.Group>
            <ImagenCarousel
              imagenesExistentes={clienteData.imagenes}
              onFilesChange={handleFileChange}
              onImagenesChange={handleImagenesChange}
            />
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
            {success && (
              <Alert variant="success" className="mt-3">
                {success}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Form>
        )}

        {step === 3 && (
          <FormularioDomicilio
            onBack={handleBack}
            onSubmit={handleDomicilioSubmit}
            initialDomicilio={new Domicilio()}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RegistroUsuarioCliente;
