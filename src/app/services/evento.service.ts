import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private url = 'http://localhost/api_eventos/eventos';

  constructor(private http: HttpClient) { }

  crearEvento( evento ) {
    return this.http.post(`${ this.url }/create.php`, evento)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }

  verEventos() {

    return this.http.get(`${ this.url }/read.php`);
  }
}
