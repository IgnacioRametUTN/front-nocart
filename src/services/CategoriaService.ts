import { Categoria } from "../entities/DTO/Categoria/Categoria";
import { Imagen } from "../entities/DTO/Imagen";

interface ApiError {
  message: string;
  status?: number;
  details?: {
    timestamp?: string;
    status?: number;
    error?: string;
    message?: string;
    path?: string;
  };
}

export class CategoriaService {
  private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/categorias`;

  private static async request(endpoint: string, options: RequestInit) {
    try {
      const response = await fetch(`${this.urlServer}${endpoint}`, options);
      const contentType = response.headers.get("content-type");


      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const error: ApiError = {
          message: responseData.message || 'Error al procesar la solicitud',
          status: response.status,
          details: responseData
        };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error('Error completo:', error);
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Error de red o servidor no disponible',
        status: 500,
        details: error
      };
    }
  }

  static async obtenerCategorias(activeSucursalId: string): Promise<Categoria[]> {
    try {
      const responseData = await this.request(`/all/${activeSucursalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Categoria[];
    } catch (error) {
      console.error('Error al obtener todas las categorias:', error);
      throw error;
    }
  }

  static async obtenerCategoriasPadre(id: string): Promise<Categoria[]> {
    try {
      const responseData = await this.request(`/padres/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return responseData as Categoria[];
    } catch (error) {
      console.error('Error al obtener todas las categorias padre:', error);
      throw error;
    }
  }

  static async obtenerCategoriaById(id: number): Promise<Categoria> {
    try {
      return await this.request(`/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Categoria;
    } catch (error) {
      console.error(`Error al obtener la categoria con ID ${id}:`, error);
      throw error;
    }
  }

  static async validateCategoria(denominacion : string) {
    try {
      const responseData = await this.request("/validate", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: denominacion,
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  static async agregarCategoria(
    idPadre: number,
    categoriaRequest: {
      categoria: Categoria,
      sucursalesIds: number[]
    }
  ): Promise<Categoria> {
    try {

      if (!categoriaRequest.categoria.denominacion?.trim()) {
        throw new Error('La denominación es requerida');
      }

      if (!categoriaRequest.sucursalesIds?.length) {
        throw new Error('Debe seleccionar al menos una sucursal');
      }

      const params = idPadre != null ? new URLSearchParams({ idCategoriaPadre: idPadre.toString() }) : null;
      const endpoint = params ? `?${params.toString()}` : '';


      const requestBody = {
        categoria: {
          denominacion: categoriaRequest.categoria.denominacion.trim(),
          alta: true,
        },
        sucursalesIds: categoriaRequest.sucursalesIds
      };

      const responseData = await this.request(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        mode: 'cors'
      });
      return responseData;
    } catch (error) {
      console.error('Error al agregar la Categoria:', error);
      throw error;
    }
  }

  static async actualizarCategoria(
    idCategoria: number,
    categoriaRequest: {
      categoria: Categoria,
      sucursalesIds: number[]
    }
  ): Promise<Categoria> {
    try {

      if (!idCategoria) {
        throw new Error('ID de categoría es requerido');
      }

      if (!categoriaRequest.categoria.denominacion?.trim()) {
        throw new Error('La denominación es requerida');
      }

      if (!categoriaRequest.sucursalesIds?.length) {
        throw new Error('Debe seleccionar al menos una sucursal');
      }

      const requestBody = {
        categoria: {
          id: categoriaRequest.categoria.id,
          denominacion: categoriaRequest.categoria.denominacion.trim(),
          alta: true,
        },
        sucursalesIds: categoriaRequest.sucursalesIds
      };
      const responseData = await this.request(`/${idCategoria}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        mode: 'cors'
      });

      return responseData;
    } catch (error) {
      console.error('Error al actualizar la Categoria:', error);

      if ((error as ApiError).status === 404) {
        throw new Error('Categoría no encontrada');
      } else if ((error as ApiError).status === 400) {
        const apiError = error as ApiError;
        const errorMessage = apiError.details?.message || 'Datos de categoría inválidos';
        throw new Error(errorMessage);
      } else if ((error as ApiError).status === 403) {
        throw new Error('No tiene permisos para actualizar esta categoría');
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Error al actualizar la categoría. Por favor, intente nuevamente.');
    }
  }

  static async eliminarCategoriaById(idSucursal: string, id: number): Promise<Categoria> {
    try {

      if (!idSucursal || !id) {
        throw new Error('ID de sucursal y categoría son requeridos');
      }

      return await this.request(`/${idSucursal}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      }) as Categoria;
    } catch (error) {
      console.error(`Error al dar de baja la categoria con ID ${id}:`, error);
      throw error;
    }
  }

  static async uploadFiles(id: number, files: File[]): Promise<Imagen[]> {
    if (!id || !files.length) {
      throw new Error('ID y archivos son requeridos');
    }


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