import { useLocation } from "react-router-dom";
import { Sucursal } from "../../entities/DTO/Sucursal/Sucursal";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import { useState } from "react";

interface SucursalDropdownProps {
  sucursales: Sucursal[];
}

const SucursalDropdown: React.FC<SucursalDropdownProps> = ({ sucursales }) => {
  const location = useLocation();
  const { activeSucursal, selectSucursal } = useAuth0Extended();
  const [loading, ] = useState(false);
  const [error, ] = useState<string | null>(null);

  const handleSucursalChange = (sucursalId: number) => {
    selectSucursal(sucursalId);
  };

  if (loading) {
    return <div className="text-right text-muted">Cargando sucursales...</div>;
  }

  if (error) {
    return <div className="text-right text-danger">{error}</div>;
  }

  // Ocultar en rutas específicas
  if (
    location.pathname === "/" ||
    location.pathname === "/unidadmedida" ||
    location.pathname === "/empresas"
  ) {
    return null;
  }

  return (
    <div className="sucursal-dropdown">
      <label htmlFor="sucursal-dropdown" className="form-label">
        Sucursal:
      </label>
      {sucursales && sucursales.length > 0 ? (
        <select
          id="sucursal-dropdown"
          className="form-select"
          value={activeSucursal}
          onChange={(e) => handleSucursalChange(Number(e.target.value))}
        >
          {sucursales.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.nombre}
            </option>
          ))}
        </select>
      ) : (
        <p>No hay sucursales disponibles</p>
      )}
    </div>
  );
};

export default SucursalDropdown;
