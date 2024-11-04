
export class ReporteService {

    private static urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/reportes`;

    private static async request(endpoint: string, idSucursal: string, options: RequestInit) {
        if (idSucursal) {
            const response = await fetch(`${this.urlServer}/sucursal/${idSucursal}${endpoint}`, options);
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Error al procesar la solicitud');
            }
            return responseData;
        }

    }

    private static async requestExcel(endpoint: string, idSucursal: string, options: RequestInit) {
        const response = await fetch(`${this.urlServer}/sucursal/${idSucursal}${endpoint}`, options);
        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                response: await response.json(),
            };
        }
        return response.blob();
    }

    static async getRankingPeriodo(startDate: string, endDate: string, sucursal: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);

        try {
            const responseData = await this.request(`/top-products?${params}`, sucursal, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            return responseData as any[];
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
            throw error;
        }

    }

    static async getMovimientos(startDate: string, endDate: string, sucursal: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);

        try {
            const responseData = await this.request(`/reporte-diario?${params}`, sucursal, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            return responseData as any[];
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
            throw error;
        }

    }
    static async getMovimientosExcel(startDate: string, endDate: string, sucursal: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);
        try {
            const responseData = await this.requestExcel(`/reporte-diario/excel?${params}`, sucursal, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            return responseData;
        } catch (error) {
            console.error('Error al generar Excel', error);
            throw error;
        }
    }

    static async getTopProductsExcel(startDate: string, endDate: string, sucursal: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);
        try {
            const responseData = await this.requestExcel(`/top-products/excel?${params}`, sucursal, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            return responseData;
        } catch (error) {
            console.error('Error al generar Excel', error);
            throw error;
        }
    }

    static async getReporteCompleto(startDate: string, endDate: string, sucursal: string) {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);
        try {
            const response = await this.requestExcel(`/pedidos/excel?${params}`, sucursal, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });

            return response;
        } catch (error) {
            console.error('Error al generar Excel:', error);
            throw error; 
        }
    }

}

export default ReporteService;