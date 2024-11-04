import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Rol } from '../entities/enums/Rol';

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  roles?: Rol[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, roles }) => {
  const { isAuthenticated, user } = useAuth0();
  const location = useLocation();

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Extraer roles del usuario
  // Reemplaza 'https://example.com/roles' con la clave correcta según tu configuración
  const userRoles = user?.['https://apiprueba/roles'] as Rol[] || [];

  // Verificar si el usuario tiene los roles necesarios
  if (roles && !roles.some(role => userRoles.includes(role))) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado y tiene el rol adecuado, renderiza el componente
  return <Component />;
};

export default PrivateRoute;
