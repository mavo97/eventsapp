import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  // private url = 'http://localhost/api_eventos/salas';
  // private url2 = 'http://localhost/api_eventos/usuarios_sala';

  private url = 'https://apeventos.herokuapp.com/api_eventos/salas';
  private url2 = 'https://apeventos.herokuapp.com/usuarios_sala';

  constructor( private http: HttpClient ) { }

  crearSala( sala ) {
    return this.http.post(`${ this.url }/create.php`, sala)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  readAll(){
    return this.http.get(`${ this.url }/readAll.php`);
  }
  bajaUsuario(id: string){
    return this.http.post(`${ this.url }/deleteuser.php`, id)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      })
    );
  }
  // usuario se registra a una sala
  registrarse( usuarioSala ) {
    return this.http.post(`${ this.url2 }/registrar.php`, usuarioSala)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  // Para admin
  usuariosenSala( id: number ) {
    return this.http.get(`${ this.url2 }/usuariosensala.php?id=${id}`);
  }
  verSalas( id: number ) {
    return this.http.get(`${ this.url }/readsalas.php?id=${id}`);
  }
  // Salas de un usuario
  usuarioSalas( id: number ) {
    return this.http.get(`${ this.url2 }/salasusuario.php?id=${id}`);
  }

  eliminarSala(id: string) {
    return this.http.post(`${ this.url }/delete.php`, id)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      })
    );
  }
  leerSala(id: number) {
    return this.http.get(`${this.url}/read_one.php?id=${id}`);
  }

  actualizarSala( sala ) {
    return this.http.post(`${this.url}/update.php`, sala);
  }
}
