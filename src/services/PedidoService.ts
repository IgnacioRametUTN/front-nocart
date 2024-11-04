import PedidoFull from "../entities/DTO/Pedido/PedidoFull";
import { Estado } from "../entities/enums/Estado";

class PedidoService {
    private static  urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/pedidos`;

    private static async request(endpoint: string, options: RequestInit) {
        const response = await fetch(`${this.urlServer}${endpoint}`, options);
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Error al procesar la solicitud');
        }
        return responseData;
    }

    static async agregarPedido(pedido: PedidoFull): Promise<number> {
        try {
            const responseData = await this.request('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
                mode: 'cors'
            });
            return responseData; 
        } catch (error) {
            console.error('Error al agregar el pedido:', error);
            throw error;
        }
    }

    static async obtenerPedidoById(id: number): Promise<PedidoFull> {
        try {
            return await this.request(`/traer/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull;
        } catch (error) {
            console.error(`Error al obtener el pedido con ID ${id}:`, error);
            throw error;
        }
    }

    static async obtenerPedidos(fecha : string, idSucursal : string): Promise<PedidoFull[]> {
        try {
            return await this.request(`/${idSucursal}/fecha/${fecha}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull[];
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
            throw error;
        }
    }
    static async obtenerPedidosCliente(id : string): Promise<PedidoFull[]> {
        try {
            return await this.request('/cliente/' + id , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull[];
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
            throw error;
        }
    }
    static async obtenerPedidosXEstado(estado : Estado, idSucursal : string): Promise<PedidoFull[]> {
        try {
            return await this.request(`/${idSucursal}/estado/${estado}` , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull[];
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
            throw error;
        }
    }
    static async actualizarEstado(id: number, estado: Estado): Promise<PedidoFull> {
        try {
            const url = `/estado/actualizar/${id}/${estado}`;
            return await this.request(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            }) as PedidoFull;
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            throw error;
        }
    }
}

export default PedidoService;
