import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Usuario from '../entities/DTO/Usuario/Usuario';
import UsuarioService from '../services/UsuarioService';
import { Rol } from '../entities/enums/Rol';

interface AuthContextType {
  isAuthenticated: boolean;
  activeUser: string;
  userRol: Rol;
  activeSucursal: string; //Para admin
  isSelected: boolean;
  login: (email: string, username: string, rol: Rol) => void;
  logout: () => void;
  selectSucursal: (idSucursal: number) => void;
  googleLogin: (response: CredentialResponse) => void;
  googleRegister: (response: CredentialResponse) => Promise<Usuario>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  activeUser: '',
  userRol: Rol.Cliente,
  activeSucursal: '0',
  isSelected: false,
  login: () => { },
  logout: () => { },
  selectSucursal: () => { },
  googleLogin: () => { },
  googleRegister: async () => { throw new Error('Not implemented') }
});

const GOOGLE_CLIENT_ID = '44321289734-fugt7imldhfb9cb8prachhhugfol4o5o.apps.googleusercontent.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated');
    return storedAuthState === 'true' || false;
  });
  const [activeUser, setActiveUser] = useState<string>(() => {
    return localStorage.getItem('activeUser') || '';
  });
  const [userRol, setUserRol] = useState<Rol>(() => {
    const storedUserRol = localStorage.getItem('userRol');
    return (storedUserRol as Rol) || Rol.Cliente;
  });
  const [isSelected, setIsSelected] = useState<boolean>(() => {
    const storedAuthState = localStorage.getItem('isSelected');
    return storedAuthState === 'true' || false;
  });
  const [activeSucursal, setActiveSucursal] = useState<string>(() => {
    return localStorage.getItem('activeSucursal') || '0';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    localStorage.setItem('activeUser', activeUser);
    localStorage.setItem('userRol', userRol);
    localStorage.setItem('isSelected', String(isSelected));
    localStorage.setItem('activeSucursal', activeSucursal);
  }, [isAuthenticated, activeUser, userRol, isSelected, activeSucursal]);

  const login = (email: string, username: string, rol: Rol) => {
    setIsAuthenticated(true);
    setActiveUser(username);
    setUserRol(rol);
    localStorage.setItem('email', email); // Guardar el email en localStorage
    localStorage.setItem('username', username); // Guardar el username en localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveUser('');
    setUserRol(Rol.Cliente);
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem("activeSucursal")
  };

  const selectSucursal = (idSucursal: number) => {
    setIsSelected(true);
    setActiveSucursal(String(idSucursal));
  };

  const googleLogin = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const decoded: any = jwtDecode(response.credential);
        const email = decoded.email;
        const username = email.split("@")[0];
  
        const validacion = await UsuarioService.validarExistenciaUsuario(username);
  
        if (validacion) {
      
          const loggedUser = await UsuarioService.login(username);
  
          login(loggedUser.email, loggedUser.username, loggedUser.rol || Rol.Cliente);
        } else {
          throw new Error("Usuario no existe");
        }
      } catch (error) {
        console.error('Error:', error);
        throw new Error("Usuario no existe");
      }
    }
  };
 const googleRegister = async (response: CredentialResponse): Promise<Usuario> => {
  if (!response.credential) {
    throw new Error("No se proporcionó credencial");
  }

  try {
    const decoded: any = jwtDecode(response.credential);
    const email = decoded.email;
    const validacion = await UsuarioService.validarExistenciaUsuario(email);
    
    if (!validacion) {
      const usuario = new Usuario();
      usuario.auth0Id = "google";
      usuario.username = email.split("@")[0];
      usuario.email = email;
      usuario.rol = Rol.Cliente;
      
      return usuario;
    } else {
      throw new Error("Usuario ya existe");
    }
  } catch (error) {
    throw new Error("Error en el registro de Google");
  }
};

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          activeUser,
          userRol,
          isSelected,
          activeSucursal,
          login,
          logout,
          selectSucursal,
          googleLogin,
          googleRegister,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
