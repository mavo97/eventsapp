import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private url = 'http://localhost/api_eventos/usuarios';

  private url = 'https://apeventos.herokuapp.com/usuarios';

  constructor( private http: HttpClient ) { }

  crearUsuario( usuario ) {
    return this.http.post(`${ this.url }/create_user.php`, usuario)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  cambiarContrasena( contrasena ) {
    return this.http.post(`${ this.url }/cambiarContrasena.php`, contrasena)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  readUsers() {
    return this.http.get(`${ this.url }/readUsers.php`);
  }

  crearPersonal( usuario ) {
    return this.http.post(`${ this.url }/create_personal.php`, usuario)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }

  crearAlumno( usuario ) {
    return this.http.post(`${ this.url }/create_alumno.php`, usuario)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }

  crearExterno( usuario ) {
    return this.http.post(`${ this.url }/create_externo.php`, usuario)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }

  eliminarUsuario(id) {
    return this.http.post(`${ this.url }/deleteuser.php`, id)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      })
    );
  }
}
