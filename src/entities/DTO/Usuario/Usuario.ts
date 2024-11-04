import { Rol } from "../../enums/Rol";

export default class Usuario {
  id?: number;
  auth0Id: string = '';
  username: string = '';
  email: string = '';
  rol?: Rol;
}