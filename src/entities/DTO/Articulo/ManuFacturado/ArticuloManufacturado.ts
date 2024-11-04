import { Articulo } from "../Articulo";
import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle";

export class ArticuloManufacturado extends Articulo {
    descripcion: string = '';
    tiempoEstimadoMinutos: number = 0;
    preparacion: string = '';
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[] = []; 
}