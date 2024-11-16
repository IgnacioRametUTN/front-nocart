import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Rol } from '../entities/enums/Rol';
import UsuarioService from '../services/UsuarioService';

interface PrivateRouteProps {
  element: React.ComponentType<any>;
  roles?: Rol[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, roles }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const [userRole, setUserRole] = useState<Rol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();

        // Llamada al servicio para obtener el rol del usuario
        const userData = await UsuarioService.login(token); // `login` devuelve un objeto `Usuario` con el rol
        setUserRole(userData.rol ?? null);  // Asigna `null` si `userData.rol` es `undefined`
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null); // Manejar el error según sea necesario
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Mostrar un indicador de carga mientras se obtienen los roles
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene el rol necesario
  if (roles && userRole && !roles.includes(userRole)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado y tiene el rol adecuado, renderiza el componente
  return <Component />;
};

export default PrivateRoute;
