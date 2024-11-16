import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Domicilio } from "../../../entities/DTO/Domicilio/Domicilio";
import { Provincia } from "../../../entities/DTO/Domicilio/Provincia";
import { ValidationErrors } from "../SucursalFormModal";
import { Localidad } from "../../../entities/DTO/Domicilio/Localidad";
import DomicilioService from "../../../services/DomicilioService";

interface FormularioDomicilioProps {
  domicilio: Domicilio;
  handleChange: (field: Partial<Domicilio>) => void;
  errors: Partial<Record<keyof ValidationErrors, string>>;
}

export const SucursalDomicilio: React.FC<FormularioDomicilioProps> = ({
  domicilio,
  handleChange,
  errors,
}) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  useEffect(() => { 
    const fetchProvincias = async () => {
      try {
        const provinciasData = await DomicilioService.getProvinciasByPais(1);
        setProvincias(provinciasData);
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Error inesperado"
        );
      }
    };

    fetchProvincias();
  }, []);

  useEffect(() => {
    const fetchLocalidades = async (idProvincia: number) => {
      try {
        const localidadesData = await DomicilioService.getLocalidadesByProvincia(idProvincia);
        setLocalidades(localidadesData);
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Error inesperado"
        );
      }
    };

    if (domicilio.localidad.provincia.id) {
      fetchLocalidades(domicilio.localidad.provincia.id);
    } else {
      setLocalidades([]);
    }
  }, [domicilio.localidad.provincia.id]);

  return (
    <div>
      <Form.Group controlId="calle">
        <Form.Label>Calle</Form.Label>
        <Form.Control
          type="text"
          value={domicilio.calle}
          onChange={(e) => handleChange({ calle: e.target.value })}
          required
        />
        {errors.calle && <small className="text-danger">{errors.calle}</small>}
      </Form.Group>

      <Form.Group controlId="numero">
        <Form.Label>Número</Form.Label>
        <Form.Control
          type="number"
          value={domicilio.numero}
          min={1}
          onChange={(e) => handleChange({ numero: Number(e.target.value) })}
          required
        />
        {errors.numero && <small className="text-danger">{errors.numero}</small>}
      </Form.Group>

      <Form.Group controlId="cp">
        <Form.Label>Código Postal</Form.Label>
        <Form.Control
          type="number"
          value={domicilio.cp}
          min={1}
          onChange={(e) => handleChange({ cp: Number(e.target.value) })}
          required
        />
        {errors.cp && <small className="text-danger">{errors.cp}</small>}
      </Form.Group>

      <Form.Group controlId="provincia">
        <Form.Label>Provincia</Form.Label>
        <Form.Control
          as="select"
          value={domicilio.localidad.provincia.id}
          onChange={(e) => {
            const selectedProvincia = provincias.find((p) => p.id === Number(e.target.value));
            handleChange({
              localidad: {
                ...domicilio.localidad,
                provincia: selectedProvincia || domicilio.localidad.provincia,
              },
            });
          }}
          required
        >
          <option value="">Selecciona una provincia</option>
          {provincias.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </Form.Control>
        {errors.provincia && <small className="text-danger">{errors.provincia}</small>}
      </Form.Group>

      <Form.Group controlId="localidad">
        <Form.Label>Localidad</Form.Label>
        <Form.Control
          as="select"
          value={domicilio.localidad.id || ""}
          onChange={(e) => {
            const selectedLocalidad = localidades.find(
              (l) => l.id === Number(e.target.value)
            );
            handleChange({
              localidad: selectedLocalidad || domicilio.localidad,
            });
          }}
          required
          disabled={!domicilio.localidad.provincia.id}
        >
          <option value="">Selecciona una localidad</option>
          {localidades.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.nombre}
            </option>
          ))}
        </Form.Control>
        {errors.localidad && <small className="text-danger">{errors.localidad}</small>}
      </Form.Group>
    </div>
  );
};