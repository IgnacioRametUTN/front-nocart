import { FormWrapper } from "../../../components/generic/FormWrapper";
import Form from "react-bootstrap/esm/Form";
import { Empleado } from "../../../entities/DTO/Empleado/Empleado";

interface Props {
  empleado: Empleado;
  handleChange: (field: Partial<Empleado>) => void;
  errors: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    fechaNacimiento?: string;
  };
}
export const EmpleadoDetails = ({ empleado, errors, handleChange }: Props) => {
  return (
    <FormWrapper title="Detalles de Empleado">
      <Form.Group controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={empleado.nombre}
          onChange={(e) => handleChange({ nombre: e.target.value })}
        />
        {errors.nombre && (
          <Form.Text className="text-danger">{errors.nombre}</Form.Text>
        )}
      </Form.Group>
      <Form.Group controlId="nombre">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="apellido"
          value={empleado.apellido}
          onChange={(e) => handleChange({ apellido: e.target.value })}
        />
        {errors.apellido && (
          <Form.Text className="text-danger">{errors.apellido}</Form.Text>
        )}
      </Form.Group>
      <Form.Group controlId="nombre">
        <Form.Label>Telefono</Form.Label>
        <Form.Control
          type="text"
          name="telefono"
          value={empleado.telefono}
          onChange={(e) => handleChange({ telefono: e.target.value })}
        />
        {errors.telefono && (
          <Form.Text className="text-danger">{errors.telefono}</Form.Text>
        )}
      </Form.Group>
      <Form.Group controlId="nombre">
        <Form.Label>Fecha de Nacimiento</Form.Label>
        <Form.Control
          type="date"
          name="fechaNacimiento"
          value={empleado.fechaNacimiento}
          onChange={(e) => handleChange({ fechaNacimiento: e.target.value })}
        />
        {errors.fechaNacimiento && (
          <Form.Text className="text-danger">{errors.fechaNacimiento}</Form.Text>
        )}
      </Form.Group>
    </FormWrapper>
  );
};
