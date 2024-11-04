import { Base } from "../Base";
import { Localidad } from "./Localidad";


export class Domicilio extends Base {
    calle: string = '';
    numero: number = 0;
    cp: number = 0;
    localidad: Localidad = new Localidad();
}