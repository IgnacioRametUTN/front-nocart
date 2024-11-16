import React, { useState, useEffect } from "react";
import UsuarioService from "../../services/UsuarioService";

import { Rol } from "../../entities/enums/Rol";
import Usuario, { UsuarioDto } from "../../entities/DTO/Usuario/Usuario";
import { Empleado } from "../../entities/DTO/Empleado/Empleado";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { EmpleadoService } from "../../services/EmpleadoService";
import { UsuarioFormModal } from "./UsuarioFormModal";
import { useSnackbar } from "../../hooks/SnackBarProvider";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const { getAccessTokenSilently } = useAuth0Extended();
  const [showModal, setShowModal] = useState(false);
  const [newEmpleado, setNewEmpleado] = useState<Empleado>(new Empleado());
  const [newUsuario, setNewUsuario] = useState<UsuarioDto>(new UsuarioDto());
  const { showError, showSuccess } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const fetchedUsers = await UsuarioService.getAllUsuarios(token);
      setUsers(fetchedUsers);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setNewEmpleado(new Empleado());
    setNewUsuario(new UsuarioDto());
    setShowModal(false);
  };

  const handleSubmit = async (
    empleado: Empleado,
    usuario: UsuarioDto,
    files: File[]
  ) => {
    try {
      const token = await getAccessTokenSilently();

      const registeredUser = await UsuarioService.createUser(usuario, token);

      // Asignar el usuario registrado al empleado
      empleado.usuario = registeredUser;
      empleado.email = empleado.usuario.email;

      // Crear el empleado
      if (registeredUser) {
        const response = await EmpleadoService.create(empleado);
        if (response) {
          const imagenes = await EmpleadoService.uploadFiles(
            response.id,
            files
          );
          response.imagenes = imagenes;
          await fetchUsers();
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRoleChange = async (userId: number, newRole: Rol) => {
    try {
      const token = await getAccessTokenSilently();
      await UsuarioService.updateUsuarioRol(userId, newRole, token);
      await fetchUsers();
      showSuccess("Rol del usuario actualizado con éxito");
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Lista de Usuarios</h2>
          <Button variant="success" onClick={() => setShowModal(true)}>
            Agregar Empleado
          </Button>
        </div>


        <div className="table-responsive">
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
                  <td>
                    <select
                      value={user.rol}
                      onChange={(e) =>
                        handleRoleChange(user.id!, e.target.value as Rol)
                      }
                      className="form-select form-select-sm"
                    >
                      {Object.values(Rol).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {showModal && (
        <UsuarioFormModal
          onHide={handleCloseModal}
          handleSubmit={handleSubmit}
          empleado={newEmpleado}
          usuario={newUsuario}
        />
      )}
    </>
  );
};
export default UserList;
