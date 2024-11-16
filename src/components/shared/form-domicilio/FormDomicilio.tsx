import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import DomicilioService from "../../../services/DomicilioService";
import { Provincia } from "../../../entities/DTO/Domicilio/Provincia";
import { Localidad } from "../../../entities/DTO/Domicilio/Localidad";
import { Domicilio } from "../../../entities/DTO/Domicilio/Domicilio";

interface FormularioDomicilioProps {
  onBack: () => void;
  onSubmit: (domicilio: Domicilio) => void;
  showButtons?: boolean;
  initialDomicilio: Domicilio;
}

const FormularioDomicilio: React.FC<FormularioDomicilioProps> = ({
  onBack,
  onSubmit,
  showButtons = true,
  initialDomicilio,
}) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [provinciaId, setProvinciaId] = useState<string>("");
  const [localidadId, setLocalidadId] = useState<string>("");
  const [calle, setCalle] = useState<string>("");
  const [numero, setNumero] = useState<number>(0);
  const [cp, setCp] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProvincias();
  }, []);

  useEffect(() => {
    if (provinciaId && provinciaId !== "0") {
      fetchLocalidades(Number(provinciaId));
    }
  }, [provinciaId]);

  useEffect(() => {
    if (initialDomicilio) {
      setCalle(initialDomicilio.calle);
      setNumero(initialDomicilio.numero);
      setCp(initialDomicilio.cp);
      setLocalidadId(initialDomicilio.localidad.id.toString());
      setProvinciaId(initialDomicilio.localidad.provincia.id.toString());
    }
  }, [initialDomicilio]);

  const fetchProvincias = async () => {
    try {
      const provincias = await DomicilioService.getProvinciasByPais(1);
      setProvincias(provincias);
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Error inesperado"
      );
    }
  };

  const fetchLocalidades = async (idProvincia: number) => {
    try {
      const localidades = await DomicilioService.getLocalidadesByProvincia(
        idProvincia
      );
      setLocalidades(localidades);
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Error inesperado"
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    initialDomicilio.calle = calle;
    initialDomicilio.numero = numero;
    initialDomicilio.cp = cp;

    const provincia = new Provincia();
    provincia.id = Number(provinciaId);
    provincia.nombre =
      provincias.find((p) => p.id === Number(provinciaId))?.nombre || "";

    const localidad = new Localidad();
    localidad.id = Number(localidadId);
    localidad.nombre =
      localidades.find((l) => l.id === Number(localidadId))?.nombre || "";
    localidad.provincia = provincia;

    initialDomicilio.localidad = localidad;

    onSubmit(initialDomicilio);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Detalles del Domicilio</h2>
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
          type="number"
          value={numero}
          min={1}
          onChange={(e) => setNumero(Number(e.target.value))}
          required
        />
      </Form.Group>
      <Form.Group controlId="cp">
        <Form.Label>Código Postal</Form.Label>
        <Form.Control
          type="number"
          value={cp}
          min={1}
          onChange={(e) => setCp(Number(e.target.value))}
          required
        />
      </Form.Group>
      <Form.Group controlId="provincia">
        <Form.Label>Provincia</Form.Label>
        <Form.Control
          as="select"
          value={provinciaId} // Cambiado a provinciaId
          onChange={(e) => setProvinciaId(e.target.value)}
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
          value={localidadId}
          onChange={(e) => setLocalidadId(e.target.value)}
          required
          disabled={provinciaId && provinciaId !== "0" ? false : true}
        >
          <option value="">Selecciona una localidad</option>
          {localidades.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.nombre}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {showButtons && (
        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={onBack}>
            Volver
          </Button>
          {loading ? (
            <Button variant="primary" type="submit" disabled>
              Guardando... <Spinner size="sm" />
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          )}
        </div>
      )}
    </Form>
  );
};

export default FormularioDomicilio;