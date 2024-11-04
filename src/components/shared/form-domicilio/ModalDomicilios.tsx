import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import DomicilioService from "../../../services/DomicilioService";
import ClienteService from "../../../services/ClienteService"; // Importa tu servicio de cliente
import { Domicilio } from "../../../entities/DTO/Domicilio/Domicilio"; // Asegúrate de importar la entidad Domicilio correcta
import { useAuth0 } from "@auth0/auth0-react";
import { Cliente } from "../../../entities/DTO/Cliente/Cliente";
interface Props {
  show: boolean;
  onHide: () => void;
  onSelectDomicilio: (domicilio: Domicilio) => void;
}
const ModalDomicilios = ({ show, onHide, onSelectDomicilio }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [cp, setCp] = useState("");
  const [provincias, setProvincias] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente>();
  const { user } = useAuth0();

  useEffect(() => {
    if (show && user) {
      fetchClienteActivo(user); // Llama a fetchClienteActivo con el usuario activo
    }
  }, [show, user]);

  const fetchClienteActivo = async (activeUser: any) => {
    try {
      // Aquí deberías implementar ClienteService.obtenerClienteByUsername
      const clienteActivo = await ClienteService.obtenerClienteByUsername(
        activeUser.username
      );
      setCliente(clienteActivo);
    } catch (error) {
      console.error("Error fetching active client:", error);
    }
  };

  const fetchProvincias = async () => {
    try {
      const provincias = await DomicilioService.getProvinciasByPais(1);
      setProvincias(provincias);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Error inesperado");
      }
    }
  };

  useEffect(() => {
    fetchProvincias();
  }, []);

  const fetchLocalidades = async (idProvincia: number) => {
    try {
      const localidades = await DomicilioService.getLocalidadesByProvincia(
        idProvincia
      );
      setLocalidades(localidades);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Error inesperado");
      }
    }
  };

  useEffect(() => {
    if (provincia) {
      fetchLocalidades(Number(provincia));
    }
  }, [provincia]);

  const handleSubmitNuevoDomicilio = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (cliente) {
        const domicilioNuevo = new Domicilio();
        domicilioNuevo.calle = calle;
        domicilioNuevo.numero = Number(numero);
        domicilioNuevo.localidad.id = Number(localidad);
        domicilioNuevo.localidad.provincia.id = Number(provincia);
        cliente?.domicilios?.push(domicilioNuevo);

        const clienteGuardado = await ClienteService.actualizarCliente(
          cliente.id,
          cliente
        );
        if (clienteGuardado) {
          onSelectDomicilio(
            clienteGuardado.domicilios.filter(
              (domicilio) =>
                domicilio.calle == domicilioNuevo.calle &&
                domicilio.cp == domicilioNuevo.cp &&
                domicilio.numero == domicilioNuevo.numero
            )[0]
          );
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error creating domicilio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDomicilio = (domicilio: Domicilio) => {
    onSelectDomicilio(domicilio);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Domicilio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Domicilios Registrados:</h5>
        {cliente &&
          cliente.domicilios.map((domicilio) => (
            <div key={domicilio.id}>
              <p>
                {domicilio.calle} {domicilio.numero}, {domicilio.cp},{" "}
                {domicilio.localidad.nombre},{" "}
                {domicilio.localidad.provincia.nombre}
              </p>
              <Button
                variant="primary"
                onClick={() => handleSelectDomicilio(domicilio)}
              >
                Seleccionar
              </Button>
            </div>
          ))}
        <hr />
        <Button
          variant="secondary"
          onClick={() => {
            setShowForm(!showForm);
            setCalle("");
            setNumero("");
            setCp("");
            setProvincia("");
            setLocalidad("");
          }}
        >
          Agregar Nuevo Domicilio
        </Button>
        {showForm && (
          <Form onSubmit={handleSubmitNuevoDomicilio}>
            <Form.Group controlId="calle">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                value={calle}
                onChange={(e) => setCalle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="numero">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="cp">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                value={cp}
                onChange={(e) => setCp(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="provincia">
              <Form.Label>Provincia</Form.Label>
              <Form.Control
                as="select"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                required
              >
                <option value="">Selecciona una provincia</option>
                {provincias.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="localidad">
              <Form.Label>Localidad</Form.Label>
              <Form.Control
                as="select"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                required
              >
                <option value="">Selecciona una localidad</option>
                {localidades.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Nuevo Domicilio"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalDomicilios;
