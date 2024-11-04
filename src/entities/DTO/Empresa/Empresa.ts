import { Base } from "../Base";
import { Imagen } from "../Imagen";
import { Sucursal } from "../Sucursal/Sucursal";

export class Empresa extends Base {
    nombre: string = '';
    razonSocial: string = '';
    cuil: string = '' ;
    imagenes: Imagen[] = [];
    alta: boolean = true; // Nueva propiedad para indicar si la empresa está activa o de baja
    sucursal: Sucursal[] = [];
}
