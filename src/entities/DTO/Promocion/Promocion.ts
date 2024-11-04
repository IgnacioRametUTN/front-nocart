
import { TipoPromocion } from "../../enums/TipoPromocion";
import { Articulo } from "../Articulo/Articulo";
import { Base } from "../Base";
import { Imagen } from "../Imagen";

export class Promocion extends Base {
  id: number = 0;
  tipoPromocion!: TipoPromocion;
  denominacion: string = '';
  fechaDesde!: Date;
  fechaHasta!: Date;
  horaDesde!: string;
  horaHasta!: string;
  descripcionDescuento: string = '';
  precioPromocional: number = 0;
  detallesPromocion: PromocionDetalle[] = [];
  imagenes: Imagen[] = [];
  alta: boolean = true;
}
export class PromocionDetalle extends Base {
    cantidad: number = 0;
    articulo: Articulo = new Articulo();
}

