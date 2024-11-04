import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth0Extended } from "../../../Auth/Auth0ProviderWithNavigate";
import EmpresaDropdown from "../../../dashboard/dropdown-sucursal-empresa/EmpresaDropdown";
import SucursalDropdown from "../../../dashboard/dropdown-sucursal-empresa/SucursalDropdown";
import SucursalService from "../../../services/SucursalService";
import { Sucursal } from "../../../entities/DTO/Sucursal/Sucursal";

const RightSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeEmpresa, selectEmpresa } = useAuth0Extended();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Si existe una empresa activa, obtener sus sucursales
    const fetchSucursales = async () => {
      if (activeEmpresa) {
        try {
          const sucursalesData =
            await SucursalService.fetchSucursalesByActiveEmpresa(
              Number(activeEmpresa)
            );
          setSucursales(sucursalesData);
        } catch (error) {
          console.error("Error al obtener las sucursales:", error);
        }
      } else {
        setSucursales([]); // Limpiar las sucursales si no hay una empresa activa
      }
    };

    fetchSucursales();
  }, [activeEmpresa]);

  if (location.pathname === "/") {
    return null;
  }

  if (location.pathname === "/empresas") {
    return null;
  }

  if (location.pathname === "/unidadmedida") {
    return null;
  }

  return (
    <div className={`right-sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div
        className="sidebar-content"
        style={{
          backgroundColor: "white",
          maxHeight: "20%",
        }}
      >
        {/* Dropdown para seleccionar empresa */}
        <EmpresaDropdown onEmpresaChange={selectEmpresa} />

        {/* Si existe una empresa activa, mostrar el dropdown de sucursales */}
        {activeEmpresa && sucursales.length > 0 && (
          <SucursalDropdown sucursales={sucursales} />
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
