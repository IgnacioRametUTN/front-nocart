import { Estado } from "../../enums/Estado";
import { TipoEnvio } from "../../enums/TipoEnvio";
import { Base } from "../Base";
import { Cliente } from "../Cliente/Cliente";
import { Domicilio } from "../Domicilio/Domicilio";
import { Sucursal } from "../Sucursal/Sucursal";
import { DetallePedido } from "./DetallePedido";

export default class PedidoFull extends Base {
    horaEstimadaFinalizacion: string = '';
    total: number = 0;
    totalCosto: number = 0;
    estado?: Estado;
    tipoEnvio?: TipoEnvio;
    formaPago: string = '';
    fechaPedido: Date = new Date();
    domicilio: Domicilio = new Domicilio();
    cliente: Cliente = new Cliente();
    detallePedidos: DetallePedido[] = [];
    sucursal:Sucursal=new Sucursal();
}
