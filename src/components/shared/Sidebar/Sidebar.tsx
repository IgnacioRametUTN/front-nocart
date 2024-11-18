import React, { useState, useEffect } from "react";
import {
  BsFillPeopleFill,
  BsBuilding,
  BsShop,
  BsBox,
  BsBasket,
  BsPercent,
  BsCart,
  BsGraphUp,
  BsPersonLinesFill
} from "react-icons/bs";
import { TbRulerMeasure } from "react-icons/tb";
import { LuChefHat } from "react-icons/lu";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { MdDeliveryDining, MdOutlineCategory } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import "./style.css";
import { useAuth0 } from "@auth0/auth0-react";
import { IconType } from "react-icons";

import logo from "../../../assets/images/Buen sabor logo 1.png";
import LoginButton from "../Log-Register/LoginButton";
import RegistroButton from "../Log-Register/RegistroButton";
import BotonLogout from "../Log-Register/BotonLogout";
import { Rol } from "../../../entities/enums/Rol";
import UsuarioService from "../../../services/UsuarioService";
import Usuario from "../../../entities/DTO/Usuario/Usuario";


interface RouteItem {
  path: string;
  icon: IconType;
  label: string;
}

type RoleRoutes = {
  [key in Rol]: RouteItem[];
};

const defaultRoutes: RouteItem[] = [
  { path: "/", icon: BsShop, label: "Tienda" },
];

const roleRoutes: RoleRoutes = {
  [Rol.Admin]: [
    { path: "/empresas", icon: BsBuilding, label: "Empresas" },
    { path: "/sucursales", icon: BsShop, label: "Sucursal" },
    { path: "/productos", icon: BsBox, label: "Productos" },
    { path: "/unidadmedida", icon: TbRulerMeasure, label: "Medidas" },
    { path: "/ingredientes", icon: BsBasket, label: "Ingredientes" },
    { path: "/promociones", icon: BsPercent, label: "Promociones" },
    { path: "/pedidos", icon: BsCart, label: "Pedidos" },
    { path: "/clientes", icon: BsFillPeopleFill, label: "Clientes" },
    { path: "/categorias", icon: MdOutlineCategory, label: "Categorias" },
    { path: "/reportes", icon: BsGraphUp, label: "Reportes" },
    { path: "/pedidos-cajero", icon: LiaCashRegisterSolid, label: "Cajero" },
    { path: "/pedidos-delivery", icon: MdDeliveryDining, label: "Delivery" },
    { path: "/pedidos-cocinero", icon: LuChefHat, label: "Cocinero" },
    { path: "/usuarios", icon: BsPersonLinesFill, label: "Usuarios" },
  ],
  [Rol.Cocinero]: [
    { path: "/unidadmedida", icon: TbRulerMeasure, label: "Medidas" },
    { path: "/ingredientes", icon: BsBasket, label: "Ingredientes" },
    { path: "/promociones", icon: BsPercent, label: "Promociones" },
    { path: "/pedidos-cocinero", icon: LuChefHat, label: "Cocinero" },
  ],
  [Rol.Cajero]: [
    { path: "/pedidos-cajero", icon: LiaCashRegisterSolid, label: "Cajero" },
  ],
  [Rol.Delivery]: [
    { path: "/pedidos-delivery", icon: MdDeliveryDining, label: "Delivery" },
  ],
  [Rol.Cliente]: [
    { path: "/misPedidos", icon: MdDeliveryDining, label: "Mis Pedidos" },
  ],
  [Rol.Empleado]: []
};

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState("");
  const [userInfo, setUserInfo] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
//Autenficacion
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated && user) {
        try {
      setIsLoading(true);
          const token = await getAccessTokenSilently();
          const userData = await UsuarioService.login(token);
           
            setUserInfo(userData);
      
          setError(null);
        } catch (err) {
          setError('Error al cargar la información del usuario');
          console.error('Error fetching user info:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserInfo(null);
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  const handleClick = (path: string) => {
    setSelected(path);
  };

  const getRoutesToDisplay = (): RouteItem[] => {
    if (!userInfo?.rol) {
      return defaultRoutes; // Solo mostrar "Tienda" si el usuario no tiene rol.
    }

    const userRoleRoutes = roleRoutes[userInfo.rol] || [];
    return [...defaultRoutes, ...userRoleRoutes];
  };

  if (isLoading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  return (
    <div
      className={`bg-dark text-white sidebar ${
        expanded ? "expanded" : "collapsed"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="ms-4 my-3">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <hr className="text-white" />
      
      <div className="d-flex flex-column h-100">
        <ul className="nav flex-column flex-grow-1 sidebar-content">
          {getRoutesToDisplay().map(({ path, icon: Icon, label }) => (
            <li className="nav-item" key={path}>
              <Link
                to={path}
                className={`nav-link text-white ${
                  location.pathname === path || selected === path ? "active" : ""
                }`}
                onClick={() => handleClick(path)}
              >
                <Icon size={24} className="me-2" />
                <span className="nav-text">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto mb-3">
          {isAuthenticated ? (
            <BotonLogout />
          ) : (
            <div className="d-flex flex-column gap-2">
              <LoginButton />
              <RegistroButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;