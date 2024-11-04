import { Articulo } from "../Articulo/Articulo";
import { Base } from "../Base";

export class DetallePedido extends Base {
    cantidad: number  = 0;
    subTotal: number  = 0;
    articulo:Articulo=new Articulo();

}