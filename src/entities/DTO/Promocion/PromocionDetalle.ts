
import { Articulo } from "../Articulo/Articulo";
import { Base } from "../Base";

export class PromocionDetalle extends Base {
    cantidad: number | null = 0;
    articulo: Articulo = new Articulo();
}

