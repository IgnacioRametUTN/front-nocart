import { Base } from "../Base";
import { Imagen } from "../Imagen"
import { Sucursal } from "../Sucursal/Sucursal";

export class Categoria extends Base {
    denominacion: string = '';
    imagenes: Imagen[] = [];
    subCategorias: Categoria[] = [];
    sucursales : Sucursal[] = [];
}