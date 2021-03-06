import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  // private url = 'http://localhost/api_eventos/actividades';
  private url = 'https://apeventos.herokuapp.com/actividades';
  constructor(private http: HttpClient) { }

  crearActividad( actividad ) {
    return this.http.post(`${ this.url }/create.php`, actividad)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  verActividades( id: number ) {
    return this.http.get(`${ this.url }/readacts.php?id=${id}`);
  }

  eliminarActividad(id: string) {
    return this.http.post(`${ this.url }/delete.php`, id)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      })
    );
  }
  leerActividad(id: number) {
    return this.http.get(`${this.url}/read_one.php?id=${id}`);
  }

  actualizarActividad( actividad ) {
    return this.http.post(`${this.url}/update.php`, actividad);
  }
}
