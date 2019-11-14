import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private url = 'http://localhost/api_eventos/salas';

  constructor( private http: HttpClient ) { }

  crearSala( sala ) {
    return this.http.post(`${ this.url }/create.php`, sala)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }

}
