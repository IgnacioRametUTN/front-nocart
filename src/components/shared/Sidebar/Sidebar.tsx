import React, { useState } from "react";
import {
  BsFillPeopleFill,
  BsBuilding,
  BsShop,
  BsBox,
  BsBasket,
  BsPercent,
  BsCart,
  BsGraphUp,
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
import { BsPersonLinesFill } from "react-icons/bs";
import { Rol } from "../../../entities/enums/Rol";

interface RouteItem {
  path: string;
  icon: IconType;
  label: string;
}

type RoleRoutes = {
  [key in Rol]?: RouteItem[];
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
};

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState("");
  const location = useLocation();
  const { isAuthenticated, user } = useAuth0();

  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  const handleClick = (path: string) => {
    setSelected(path);
  };

  const userRoles: Rol[] = user
    ? (user["https://apiprueba/roles"] as Rol[])
    : [];
  const routesToDisplay =
    isAuthenticated && userRoles.length > 0
      ? roleRoutes[userRoles[0]] || []
      : [];

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
      <ul className="nav flex-column flex-grow-1 sidebar-content">
        {defaultRoutes.map(({ path, icon: Icon, label }) => (
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

        {routesToDisplay.map(({ path, icon: Icon, label }) => (
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
      <div className="mt-auto">
        {isAuthenticated ? (
          <BotonLogout />
        ) : (
          <div>
            <LoginButton /> <RegistroButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
