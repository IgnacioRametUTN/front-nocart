import { Imagen } from "../../Imagen";
import { Articulo } from "../Articulo";


export class ArticuloInsumo extends Articulo {
    precioCompra: number = 0;
    stockActual: number = 0;
    stockMaximo: number = 0;
    esParaElaborar: boolean | null = false;
    imagenes: Imagen[] = [];
}