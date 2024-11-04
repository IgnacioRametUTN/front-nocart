import { Empleado } from "../entities/DTO/Empleado/Empleado";
import { Imagen } from "../entities/DTO/Imagen";
import { RedirectDto } from "../entities/DTO/RedirectDto";

export class EmpleadoService {

    private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/empleados`;
  
    private static async request(endpoint: string, options: RequestInit) {
      const response = await fetch(`${this.urlServer}${endpoint}`, options);
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Error al procesar la solicitud');
      }
      return responseData;
    }
  
    
  
    static async getOne(id: number): Promise<Empleado> {
      try {
        return await this.request(`/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        }) as Empleado;
      } catch (error) {
        console.error(`Error al obtener el Empleado con ID ${id}:`, error);
        throw error;
      }
    }
  
    static async create(empleado: Empleado): Promise<Empleado> {
      try {
        const responseData = await this.request(``, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(empleado),
          mode: 'cors'
        });
        return responseData;
      } catch (error) {
        console.error('Error al agregar el Empleado:', error);
        throw error;
      }
    }
  
    static async formTrabajo(email : string): Promise<RedirectDto> {
      try {
        const responseData = await this.request(`/formulario/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        return responseData as RedirectDto;
      } catch (error) {
        console.error('Error al obtener url:', error);
        throw error;
      }
    }
  
    static async delete(id: number): Promise<Empleado> {
      try {
        return await this.request(`/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        }) as Empleado;
      } catch (error) {
        console.error(`Error al dar de baja el Empleado con ID ${id}:`, error);
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
  
  