import { Base } from "../Base";
import { Domicilio } from "../Domicilio/Domicilio";
import { Imagen } from "../Imagen";
import Usuario from "../Usuario/Usuario";
export class Cliente extends Base {
    nombre: string = '';
    apellido: string = '';
    telefono: string = '';
    fechaNacimiento: string | null = '';
    imagenes: Imagen[] = [];
    domicilios: Domicilio[] = [];
    usuario: Usuario = new Usuario();
}
