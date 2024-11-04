import { ArticuloManufacturado } from "../entities/DTO/Articulo/ManuFacturado/ArticuloManufacturado";
import { Imagen } from "../entities/DTO/Imagen";

export class ProductServices {

  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/articulos/manufacturados`;

  private static async request(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.urlServer}${endpoint}`, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al procesar la solicitud');
    }
    return responseData;
  }

  static async getAll(idSucursal: string): Promise<ArticuloManufacturado[]> {
    try {
      const responseData = await this.request(`/${idSucursal}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }

  static async getAllCategoriaAndSubCategoria(idSucursal: string, idCategoria: number): Promise<ArticuloManufacturado[]> {
    try {
      const responseData = await this.request(`/${idSucursal}/categoria/${idCategoria}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }

  static async getAllproductsfromSucursal(idSucursal: string): Promise<ArticuloManufacturado[]> {
    try {
      const responseData = await this.request(`/sucursal/${idSucursal}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }
  static async getProductsByCategoryfromSucursal(idSucursal: string, idCategoria : number = 0): Promise<ArticuloManufacturado[]> {
    try {
      const responseData = await this.request(`/${idSucursal}/categoria/${idCategoria}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }

  static async getOne(id: number): Promise<ArticuloManufacturado> {
    try {
      return await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as ArticuloManufacturado;
    } catch (error) {
      console.error(`Error al obtener el ArticuloManufacturado con ID ${id}:`, error);
      throw error;
    }
  }

  static async create(ArticuloManufacturado: ArticuloManufacturado, idSucursal: string): Promise<ArticuloManufacturado> {
    try {
      const responseData = await this.request(`/${idSucursal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ArticuloManufacturado),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar el ArticuloManufacturado:', error);
      throw error;
    }
  }

  static async update(id: number, ArticuloManufacturado: ArticuloManufacturado): Promise<ArticuloManufacturado> {
    try {
      const responseData = await this.request(`/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ArticuloManufacturado),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al actualizar el ArticuloManufacturado:', error);
      throw error;
    }
  }

  static async delete(id: number): Promise<ArticuloManufacturado> {
    try {
      return await this.request(`/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as ArticuloManufacturado;
    } catch (error) {
      console.error(`Error al dar de baja el ArticuloManufacturado con ID ${id}:`, error);
      throw error;
    }
  }

  static async getAllFiltered(idSucursal: string, idCategoria?: number, idUnidadMedida?: number, denominacion?: string): Promise<ArticuloManufacturado[]> {
    try {
      const params = new URLSearchParams();
      if (idCategoria !== undefined) params.append("categoria_id", idCategoria.toString());
      if (idUnidadMedida !== undefined) params.append("unidad_id", idUnidadMedida.toString());
      if (denominacion !== undefined) params.append("denominacion", denominacion);

      const responseData = await this.request(`/${idSucursal}/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as ArticuloManufacturado[];
    } catch (error) {
      console.error('Error al obtener todas los ArticuloManufacturados:', error);
      throw error;
    }
  }

  static async uploadFiles(id: number, files: File[]): Promise<Imagen[]> {
    const uploadPromises = files.map(file => {
      const formData = new FormData();
      formData.append('uploads', file);
      formData.append('id', String(id));

      return this.request(`/uploads`, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      }) as Promise<Imagen>;
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error(`Error al subir imágenes para el id ${id}:`, error);
      throw error;
    }
  }

}
