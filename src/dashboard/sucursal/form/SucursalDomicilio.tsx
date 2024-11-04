import React, {} from "react";
import { Form } from "react-bootstrap";
import { Domicilio } from "../../../entities/DTO/Domicilio/Domicilio";
import { Provincia } from "../../../entities/DTO/Domicilio/Provincia";
import { ValidationErrors } from "../SucursalFormModal";
import { Localidad } from "../../../entities/DTO/Domicilio/Localidad";

interface FormularioDomicilioProps {
  domicilio: Domicilio;
  localidades: Localidad[];
  provincias: Provincia[];
  handleChange: (field: Partial<Domicilio>) => void;
  errors: Partial<Record<keyof ValidationErrors, string>>;
}

export const SucursalDomicilio: React.FC<FormularioDomicilioProps> = ({
  domicilio,
  handleChange,
  errors,
  localidades,
  provincias,
}) => {
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
        {errors.numero && (
          <small className="text-danger">{errors.numero}</small>
        )}
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
            handleChange({
              localidad: {
                ...domicilio.localidad,
                provincia:
                  provincias.find((p) => p.id === Number(e.target.value)) ||
                  domicilio.localidad.provincia,
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
        {errors.provincia && (
          <small className="text-danger">{errors.provincia}</small>
        )}
      </Form.Group>

      <Form.Group controlId="localidad">
        <Form.Label>Localidad</Form.Label>
        <Form.Control
          as="select"
          value={domicilio.localidad.id || ""}
          onChange={(e) =>
            handleChange({
              localidad: localidades.find(
                (l) => l.id === Number(e.target.value)
              ) ||
                domicilio.localidad || {
                  provincia: { id: 0, nombre: "" },
                  nombre: "",
                },
            })
          }
          required
          disabled={!domicilio.localidad.provincia.id}
        >
          <option value="">Selecciona una localidad</option>
          {localidades
            .filter(
              (loc) =>
                loc.provincia.id == domicilio.localidad.provincia.id
            )
            .map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.nombre}
              </option>
            ))}
        </Form.Control>
        {errors.localidad && (
          <small className="text-danger">{errors.localidad}</small>
        )}
      </Form.Group>
    </div>
  );
};
