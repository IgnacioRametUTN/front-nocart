import React, { useState, useEffect } from "react";
import { Cliente } from "../../../entities/DTO/Cliente/Cliente";
import { useAuth } from "../../../Auth/Auth";

const ClienteFormulario: React.FC = () => {
  const { activeUser } = useAuth();
  const [cliente, setCliente] = useState<Cliente>(new Cliente());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/cliente/${activeUser}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar los datos del cliente.");
        }
        const data = await response.json();
        setCliente(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos del cliente:", error);
      }
    };

    fetchCliente();
  }, [activeUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prevState: Cliente) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8080/api/clientes/${cliente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
      alert("Datos actualizados correctamente.");
    } catch (error) {
      console.error("Error al actualizar los datos del cliente:", error);
    }
  };

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido:</label>
          <input
            type="text"
            className="form-control"
            name="apellido"
            value={cliente.apellido}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Nacimiento:</label>
          <input
            type="date"
            className="form-control"
            name="fechaNacimiento"
            value={cliente.fechaNacimiento || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default ClienteFormulario;
