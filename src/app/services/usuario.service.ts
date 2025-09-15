import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarios = [
    { id: 1, nombre: 'João', email: 'joao@mail.com', idEdad: 30 },
    { id: 2, nombre: 'Maria', email: 'maria@mail.com', idEdad: 25 },
    { id: 3, nombre: 'Juan', email:  'juan@mail.com', idEdad: 40 },
    { id: 3, nombre: 'Adrian', email:  'adrian@mail.com', idEdad: 40 },
    { id: 3, nombre: 'Javier', email:  'javier@mail.com', idEdad: 40 },
    { id: 3, nombre: 'Sofia', email:  'sofia@mil.com', idEdad: 40 },
  ];

  getUsuarios(): Observable<any[]> {
    return of(this.usuarios);
  }

  constructor() { }
  
}