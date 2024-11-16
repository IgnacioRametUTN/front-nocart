
import Usuario, { UsuarioDto } from "../entities/DTO/Usuario/Usuario";
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

  static async createUser(usuario: UsuarioDto, token: string): Promise<Usuario> {
    try {
      const responseData = await this.request('/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario),
      });
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al crear usuario:', error);
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
      // Enviamos el rol directamente como texto en el body
      const responseData = await this.request(`/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'  // Cambiamos el Content-Type a text/plain
        },
        body: newRol  // Enviamos el rol directamente como string
      });
      return responseData as Usuario;
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      throw error;
    }
  }
}

export default UsuarioService;