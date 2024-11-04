import React, { useState } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../../Auth/Auth";

import UsuarioService from "../../../services/UsuarioService";
import { GoogleLogin } from "@react-oauth/google";
import { Rol } from "../../../entities/enums/Rol";

interface LoginProps {
  closeModal: () => void;
}

const Login: React.FC<LoginProps> = ({ closeModal }) => {
  const { login, googleLogin } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [auth0Id, setAuth0Id] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !auth0Id) {
      setMensaje(
        "Por favor, ingrese tanto el nombre de usuario como la contraseña."
      );
      return;
    }
    try {
      setLoading(true);
      const data = await UsuarioService.login(username);
      if (data && data.rol) {
        setTimeout(() => {
          setLoading(false);
          login(data.email, data.username, data.rol || Rol.Cliente);
          closeModal();
        }, 1500);
      }
    } catch (err) {
      setMensaje("Credenciales incorrectas, por favor vuelva a intentarlo.");
      console.error(err);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Nombre de Usuario:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setMensaje("");
            }}
            placeholder="Ingrese su nombre de usuario"
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Clave:</Form.Label>
          <Form.Control
            type="password"
            value={auth0Id}
            onChange={(e) => {
              setAuth0Id(e.target.value);
              setMensaje("");
            }}
            placeholder="Ingrese su clave"
            required
          />
        </Form.Group>
        {!loading ? (
          <Button variant="primary" type="submit">
            Login
          </Button>
        ) : (
          <Button variant="primary" disabled>
            Loging in<Spinner size={"sm"}></Spinner>
          </Button>
        )}

        {mensaje && <Alert variant="danger">{mensaje}</Alert>}
      </Form>

      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            await googleLogin(credentialResponse);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              closeModal();
            }, 1500);
          } catch (error) {
            setLoading(false);
            if (error instanceof Error) {
              setMensaje(error.message);
            }
          }
        }}
        onError={() => {
          setMensaje("Hubo un error con tu login con google");
        }}
      />
    </>
  );
};

export default Login;
