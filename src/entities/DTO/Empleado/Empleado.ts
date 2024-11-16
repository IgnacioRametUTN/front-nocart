import { Base } from "../Base";
import { Imagen } from "../Imagen";

import Usuario from "../Usuario/Usuario";
export class Empleado extends Base {
    nombre: string = '';
    apellido: string = '';
    telefono: string = '';
    email: string = '';
    fechaNacimiento: string = '';
    imagenes: Imagen[] = [];
    usuario: Usuario = new Usuario();
}
