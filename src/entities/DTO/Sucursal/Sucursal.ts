import { Base } from "../Base";
import { Categoria } from "../Categoria/Categoria";
import { Domicilio } from "../Domicilio/Domicilio";
import { Empresa } from "../Empresa/Empresa";
import { Imagen } from "../Imagen";

export class Sucursal extends Base {
    nombre: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    empresa: Empresa = new Empresa();
    imagenes: Imagen[] = [];
    domicilio: Domicilio = new Domicilio();
    categorias: Categoria[] = [];
}