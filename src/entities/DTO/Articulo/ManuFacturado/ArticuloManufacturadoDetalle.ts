import { Base } from "../../Base";
import { ArticuloInsumo } from "../Insumo/ArticuloInsumo";

export class ArticuloManufacturadoDetalle extends Base {
    cantidad: number | null = 0;
    articuloInsumo: ArticuloInsumo | null = null;
}