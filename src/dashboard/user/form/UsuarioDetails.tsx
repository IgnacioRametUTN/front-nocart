import { FormWrapper } from "../../../components/generic/FormWrapper";
import Form from "react-bootstrap/esm/Form";
import { UsuarioDto } from "../../../entities/DTO/Usuario/Usuario";
import { Rol } from "../../../entities/enums/Rol";

interface Props {
  usuario: UsuarioDto;
  handleChange: (field: Partial<UsuarioDto>) => void;
  errors: {
    email?: string;
    password?: string;
    rol?: string;
  };
}
export const UsuarioDetails = ({ usuario, errors, handleChange }: Props) => {
  return (
    <FormWrapper title="Detalles de Usuario">
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={usuario.email}
          onChange={(e) => handleChange({ email: e.target.value })}
        />
        {errors.email && (
          <Form.Text className="text-danger">{errors.email}</Form.Text>
        )}
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={usuario.password}
          onChange={(e) => handleChange({ password: e.target.value })}
        />
        {errors.password && (
          <Form.Text className="text-danger">{errors.password}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Rol</Form.Label>
        <Form.Select
          value={usuario.rol}
          onChange={(e) => handleChange({ rol: e.target.value as Rol })}
          required
        >
          {Object.values(Rol).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </FormWrapper>
  );
};
