// src/services/DomicilioService.ts
import { Domicilio } from "../entities/DTO/Domicilio/Domicilio";


const API_URL = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/domicilios`;

class DomicilioService {

    async saveDomicilio(domicilio: Domicilio) {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(domicilio),
        });

        if (!response.ok) {
            throw new Error(`Error saving domicilio: ${response.statusText}`);
        }

        return await response.json();
    }

    async getAllDomicilios() {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching domicilios: ${response.statusText}`);
        }

        return await response.json();
    }

    async getLocalidadesByProvincia(idProvincia: number) {
        const response = await fetch(`${API_URL}/localidades/${idProvincia}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching domicilios: ${response.statusText}`);
        }

        return await response.json();
    }

    async getProvinciasByPais(idPais: number = 2) {
        const response = await fetch(`${API_URL}/provincias/${idPais}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching domicilios: ${response.statusText}`);
        }

        return await response.json();
    }

    async getDomicilioById(id: number) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching domicilio: ${response.statusText}`);
        }

        return await response.json();
    }

    async updateDomicilio(id: number, domicilio: Domicilio) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(domicilio),
        });

        if (!response.ok) {
            throw new Error(`Error updating domicilio: ${response.statusText}`);
        }

        return await response.json();
    }

    async deleteDomicilio(id: number) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting domicilio: ${response.statusText}`);
        }

        return await response.json();
    }
}

export default new DomicilioService();
