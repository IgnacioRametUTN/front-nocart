import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Cliente } from "../../entities/DTO/Cliente/Cliente";
import ClienteService from "../../services/ClienteService";
import FiltroClientes from "./FiltroCliente";

export default function ClientTable() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchedNombre, setSearchedNombre] = useState<string | undefined>(
    undefined
  );
  const [searchedApellido, setSearchedApellido] = useState<string | undefined>(
    undefined
  );

  const fetchClientes = async (nombre?: string, apellido?: string) => {
    try {
      const clientesFiltered = await ClienteService.obtenerClientes(
        nombre,
        apellido
      );
      setClientes(clientesFiltered);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    fetchClientes(searchedNombre, searchedApellido);
  }, [searchedNombre, searchedApellido]);

  const handleChangeNombre = (nombre: string) => {
    setSearchedNombre(nombre.trim() ? nombre : undefined);
  };

  const handleChangeApellido = (apellido: string) => {
    setSearchedApellido(apellido.trim() ? apellido : undefined);
  };

  return (
    <div className="container">
      <FiltroClientes
        handleChangeNombre={handleChangeNombre}
        handleChangeApellido={handleChangeApellido}
      />
      <Table hover>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Fecha de Nacimiento</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="text-center">
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.usuario.email}</td>
              <td>{cliente.fechaNacimiento}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
