// src/components/Register.tsx
import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Rol } from "../../../entities/enums/Rol";
import Usuario from "../../../entities/DTO/Usuario/Usuario";
import UsuarioService from "../../../services/UsuarioService";
import { GoogleLogin } from "@react-oauth/google";

interface RegisterProps {
  closeModal: () => void;
}

const Register: React.FC<RegisterProps> = ({ closeModal }) => {
  const [username, setUsername] = useState<string>("");
  const [auth0Id, setAuth0Id] = useState<string>("");
  const [rol, setRol] = useState<Rol>(Rol.Cliente);
  const [mensaje, setMensaje] = useState<string>("");
  const [Registromensaje, setRegistromensaje] = useState<string>("");

  const getToken = () => {
    // Aquí deberías obtener el token de una fuente segura
    // Ejemplo: desde el contexto de autenticación, almacenamiento local, etc.
    return "your-auth-token"; // Reemplaza con la lógica real para obtener el token
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth0Id.length < 4) {
      setMensaje("La clave debe tener al menos 4 caracteres");
      return;
    }
    try {
      const usuario: Usuario = {
        username,
        auth0Id,
        rol,
        email: "",
      };
      const token = getToken(); // Obtener el token
      await UsuarioService.register(usuario, token); // Pasar el objeto Usuario y el token
      setRegistromensaje("Usuario registrado con éxito");
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setMensaje(err.message);
      }
      console.error(err);
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {

    console.log(credentialResponse);
    closeModal();
  };

  const handleGoogleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Nombre de Usuario:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingrese su nombre de usuario"
          required
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Clave:</Form.Label>
        <Form.Control
          type="password"
          value={auth0Id}
          onChange={(e) => setAuth0Id(e.target.value)}
          placeholder="Ingrese su clave"
          required
        />
      </Form.Group>
      <Form.Group controlId="formBasicRole">
        <Form.Label>Rol:</Form.Label>
        <Form.Select
          value={rol}
          onChange={(e) => setRol(e.target.value as Rol)}
          required
        >
          <option value={Rol.Cliente}>Cliente</option>
          <option value={Rol.Admin}>Administrador</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">
        Registro
      </Button>
      <div className="my-3">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </div>
      {Registromensaje && <Alert variant="success">{Registromensaje}</Alert>}
      {mensaje && <Alert variant="danger">{mensaje}</Alert>}
    </Form>
  );
};

export default Register;
