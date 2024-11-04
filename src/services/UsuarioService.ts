import Usuario from "../entities/DTO/Usuario/Usuario";
import { Rol } from "../entities/enums/Rol";

class UsuarioService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/auth`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al procesar la solicitud');
    }
    return response.json();
  }

  static async login(token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al hacer el Login', error);
      throw error;
    }
  }

  static async register(usuario: Usuario, token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario),
      });
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }

  static async validarExistenciaUsuario(token: string): Promise<boolean> {
    try {
      const responseData = await this.request(`/validar`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData;
    } catch (error) {
      console.error('Error al validar existencia usuario:', error);
      throw error;
    }
  }

  static async deleteUsuario(id: number, token: string): Promise<void> {
    try {
      await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  static async getAll(token: string): Promise<Usuario[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      throw error;
    }
  }

  static async getAllUsuarios(token: string): Promise<Usuario[]> {
    try {
      const responseData = await this.request('/usuarios', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      return responseData as Usuario[];
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      throw error;
    }
  }

  static async updateUsuarioRol(id: number, newRol: Rol, token: string): Promise<Usuario> {
    try {
      // Actualiza el rol en la base de datos local
      const updatedUser = await this.request(`/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: newRol, // Envía el rol directamente como JSON
      }) as Usuario;

      
      const managementToken = await this.getAuth0ManagementToken();

      // Actualiza el rol en Auth0
      const auth0UserId = updatedUser.auth0Id;
      await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${auth0UserId}/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roles: [newRol] 
        }),
      });

      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      throw error;
    }
  }

  private static async getAuth0ManagementToken(): Promise<string> {
    const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: import.meta.env.VITE_AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: import.meta.env.VITE_AUTH0_MANAGEMENT_CLIENT_SECRET,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el token de Auth0 Management API');
    }

    const data = await response.json();
    return data.access_token;
  }
}

export default UsuarioService;
