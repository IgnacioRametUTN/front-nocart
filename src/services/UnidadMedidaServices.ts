import { UnidadMedida } from "../entities/DTO/UnidadMedida/UnidadMedida";


class UnidadMedidaService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/unidades-medida`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async getAll(): Promise<UnidadMedida[]> {
    try {
      const responseData = await this.request('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as UnidadMedida[];
    } catch (error) {
      console.error('Error al obtener Unidades Medida:', error);
      throw error;
    }
  }

  static async getOne(id: number): Promise<UnidadMedida> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as UnidadMedida;
    } catch (error) {
      console.error(`Error al obtener Unidad Medida: de ID ${id}`, error);
      throw error;
    }
  }

  static async create(unidadMedida: UnidadMedida): Promise<UnidadMedida> {
    try {
      const responseData = await this.request(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unidadMedida),
        mode: 'cors'
      });
      return responseData as UnidadMedida;
    } catch (error) {
      console.error(`Error al agregar Unidad Medida`, error);
      throw error;
    }
  }

  static async update(id: number, unidadMedida: UnidadMedida): Promise<UnidadMedida> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unidadMedida),
        mode: 'cors'
      });
      return responseData as UnidadMedida;
    } catch (error) {
      console.error(`Error al actualizar Unidad Medida: de ID ${id}`, error);
      throw error;
    }
  }

  static async eliminarUnidadMedidaById(id: number): Promise<UnidadMedida> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as UnidadMedida;
    } catch (error) {
      console.error(`Error al obtener Unidad Medida: de ID ${id}`, error);
      throw error;
    }
  }
}
export default UnidadMedidaService;