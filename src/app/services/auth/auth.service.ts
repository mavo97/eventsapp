import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost/api_eventos/usuarios';
  private uLogueado = new BehaviorSubject('NoLogueado');
  currentMessage = this.uLogueado.asObservable();
  token = localStorage.getItem('jwt');

  
  constructor( private http: HttpClient,
               private router: Router ) { 

                if (this.token ){
                  this.changeMessage('Logueado');
                }else{
                  this.changeMessage('NoLogueado'); 
                }
               }
               

  logIn( datos ) {
    return this.http.post(`${this.url}/login.php`, datos)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }

  changeMessage(message: string) {
    this.uLogueado.next(message);
  }

  validateToken( token ) {
    return this.http.post(`${this.url}/validate_token.php`, token)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  logOut() {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/login');

  }
}



