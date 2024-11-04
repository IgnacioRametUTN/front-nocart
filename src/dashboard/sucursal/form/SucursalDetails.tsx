import { Sucursal } from "../../../entities/DTO/Sucursal/Sucursal";
import { FormWrapper } from "../../../components/generic/FormWrapper";
import Form from "react-bootstrap/esm/Form";
interface Props {
  sucursal: Sucursal;
  handleChange: (field: Partial<Sucursal>) => void;
  errors: {
    nombre?: string;
    horarioApertura?: string;
    horarioCierre?: string;
    validez? : string
  };
}
export const SucursalDetails = ({ sucursal, handleChange, errors }: Props) => {
  return (
    <FormWrapper title="Detalles de Sucursal">
      <Form.Group controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={sucursal.nombre}
          onChange={(e) => handleChange({ nombre: e.target.value })}
        />
        {errors.nombre && (
          <Form.Text className="text-danger">{errors.nombre}</Form.Text>
        )}
      </Form.Group>
      <Form.Group controlId="horarioApertura">
        <Form.Label>Horario Apertura</Form.Label>
        <Form.Control
          type="time"
          name="horarioApertura"
          value={sucursal.horarioApertura || ""}
          onChange={(e) => handleChange({ horarioApertura: e.target.value })}
        />
        {errors.horarioApertura && (
          <Form.Text className="text-danger">
            {errors.horarioApertura}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group controlId="horarioCierre">
        <Form.Label>Horario Cierre</Form.Label>
        <Form.Control
          type="time"
          name="horarioCierre"
          value={sucursal.horarioCierre || ""}
          onChange={(e) => handleChange({ horarioCierre: e.target.value })}
        />
        {errors.horarioApertura && (
          <Form.Text className="text-danger">
            {errors.horarioApertura}
          </Form.Text>
        )}
      </Form.Group>
      {errors.validez && (
        <Form.Text className="text-danger">{errors.validez}</Form.Text>
      )}
    </FormWrapper>
  );
};
