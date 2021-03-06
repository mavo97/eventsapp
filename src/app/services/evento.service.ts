import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  // private url = 'http://localhost/api_eventos/eventos';
  // private url2 = 'http://localhost/api_eventos/usuarios_evento';
  private url = 'https://apeventos.herokuapp.com/eventos';
  private url2 = 'https://apeventos.herokuapp.com/usuarios_evento';

  constructor(private http: HttpClient) { }

  crearEvento( evento ) {
    return this.http.post(`${ this.url }/create.php`, evento)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
  }
  registrarEvento( usuarioEvento ) {
    return this.http.post(`${ this.url2 }/registrar.php`, usuarioEvento)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      }),
    );
   }
  verEventos() {
    return this.http.get(`${ this.url }/read.php`);
  }
  verHistorial() {
    return this.http.get(`${ this.url }/read2.php`);
  }
  eventosDisponibles() {
    return this.http.get(`${ this.url }/availables.php`);
  }

  eliminarEvento(id: string) {
    return this.http.post(`${ this.url }/delete.php`, id)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      })
    );
  }

  leerEvento(id: number) {
    return this.http.get(`${this.url}/read_one.php?id=${id}`);
  }
  // Eventos de un usuario
  usuarioEvento(id: number) {
    return this.http.get(`${this.url2}/eventosusuario.php?id=${id}`);
  }

  actualizarEvento( evento ) {
    return this.http.post(`${this.url}/update.php`, evento);
  }
  // Usuarios en un evento
  usuarioEventos( id: number ) {
    return this.http.get(`${ this.url2 }/usuariosenevento.php?id=${id}`);
  }
  bajaUsuario(id: string){
    return this.http.post(`${ this.url }/deleteuser.php`, id)
    .pipe(
      map( ( resp: any ) => {
        return resp;
      })
    );
  }
}
