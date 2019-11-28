import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // private url = 'http://localhost/api_eventos/usuarios';
  
  private url = 'https://apeventos.herokuapp.com/api_eventos/usuarios';
  constructor( private http: HttpClient ) { }

  crearUsuario( usuario ) {
    return this.http.post(`${ this.url }/create_user.php`, usuario)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  readUsers(){
    return this.http.get(`${ this.url }/readUsers.php`);
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
