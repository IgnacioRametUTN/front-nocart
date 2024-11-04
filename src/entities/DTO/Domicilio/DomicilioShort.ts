import { Base } from "../Base";

export class DomicilioShort extends Base {
    calle: string = '';
    numero: number = 0;
    localidad: string = '';
  
    printDireccion(): string {
      return `${this.calle} ${this.numero}, ${this.localidad}`;
    }
  }
  