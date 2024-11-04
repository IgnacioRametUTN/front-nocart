import { Base } from "../Base";
import { Pais } from "./Pais";


export class Provincia extends Base {
    nombre: string = '';
    pais: Pais = new Pais();
}