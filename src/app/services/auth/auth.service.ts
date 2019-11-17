import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost/api_eventos/usuarios';

  constructor( private http: HttpClient ) { }

  logIn( datos ) {
    return this.http.post(`${this.url}/login.php`, datos)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  validateToken( token ) {
    return this.http.post(`${this.url}/validate_token.php`, token)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
}



