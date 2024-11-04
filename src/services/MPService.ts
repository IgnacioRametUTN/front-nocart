import PreferenceMP from "../entities/DTO/MP/PreferenceMP";
import PedidoFull from "../entities/DTO/Pedido/PedidoFull";

export async function createPreferenceMP(pedido?: PedidoFull) {
    const urlServer = `${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/mercado-pago/crear_preference_mp`;
    
    const method: string = "POST";
    const response = await fetch(urlServer, {
        method: method,
        body: JSON.stringify(pedido),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await response.json()) as PreferenceMP;
}