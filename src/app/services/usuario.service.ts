import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost/api_eventos/usuarios';
  
  constructor( private http: HttpClient ) { }

  crearUsuario( usuario ) {
    return this.http.post(`${ this.url }/create_user.php`, usuario)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
}
