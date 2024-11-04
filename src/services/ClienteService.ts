import { Cliente } from "../entities/DTO/Cliente/Cliente";

class ClienteService {
    private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/clientes`;

    private static async request(endpoint: string, options: RequestInit) {
        const response = await fetch(`${this.urlServer}${endpoint}`, {
            ...options,
            mode: 'cors'
        });

        let responseData;
        try {
            const text = await response.text();
            responseData = text ? JSON.parse(text) : null;
        } catch (error) {
            throw new Error('Error al parsear la respuesta JSON');
        }

        if (!response.ok) {
            throw new Error(responseData.message || 'Error al procesar la solicitud');
        }
        return responseData;
    }

    static async agregarCliente(cliente: Cliente): Promise<Cliente> {
        try {
            const responseData = await this.request('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
            });
            return responseData as Cliente; 
        } catch (error) {
            console.error('Error al agregar el cliente:', error);
            throw error;
        }
    }

    static async actualizarCliente(idCliente: number, cliente: Cliente): Promise<Cliente> {
        try {
            const responseData = await this.request(`/${idCliente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
            });
            return responseData as Cliente; 
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            throw error;
        }
    }

    static async obtenerClienteById(id: number): Promise<Cliente> {
        try {
            const responseData = await this.request(`/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return responseData as Cliente;
        } catch (error) {
            console.error(`Error al obtener el cliente con ID ${id}:`, error);
            throw error;
        }
    }

    static async obtenerClientes(nombre?: string, apellido?: string): Promise<Cliente[]> {
        try {
            const queryParams = new URLSearchParams();
            if (nombre) queryParams.append('nombre', nombre);
            if (apellido) queryParams.append('apellido', apellido);
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            
            const responseData = await this.request(`/${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return responseData as Cliente[];
        } catch (error) {
            console.error('Error al obtener los Clientes:', error);
            throw error;
        }
    }

    static async obtenerClienteByUsername(username: string): Promise<Cliente> {
        try {
            const responseData = await this.request(`/username/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return responseData as Cliente;
        } catch (error) {
            console.error(`Error al obtener el cliente por username ${username}:`, error);
            throw error;
        }
    }
}

export default ClienteService;
