import { Base } from "../Base";
import { Provincia } from "./Provincia";

export class Localidad extends Base {
    nombre: string = '';
    provincia: Provincia = new Provincia();
}