import { Component, OnInit, DoCheck } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// Models
import { verEventosModel, EventModel } from '../../models/evento.model';
import { UsuarioModel, tokenModel, dataUserModel } from '../../models/usuario.model';

// Services
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth/auth.service';
// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck{

  eventos: verEventosModel = new verEventosModel(); // Array de eventos
  usuario: UsuarioModel = new UsuarioModel();
  mostrarA: boolean;
  ver: string;
  token = localStorage.getItem('jwt');

  constructor( private _eventoService: EventoService,
               private _route: Router,
               private authServices: AuthService ) { }

  ngOnInit() {
    this.llamarEventos();
    this.buscarUsuario();
  }

  ngDoCheck() {
    this.authServices.messageCurrent.subscribe(message => this.ver = message);
  }

  // Funcion para llamar a los eventos
  llamarEventos() {
    this._eventoService.eventosDisponibles()
    .subscribe((resp: verEventosModel) => {
      this.eventos = resp;
      this.mostrarA = true;
      // console.log(this.eventos);
    }, (error) => {
      this.mostrarA = false;
      // console.log(error);
    });
  }
  buscarUsuario() {
    if ( this.token ) {
      const token2: object = {
        jwt: this.token
      };
      const tokenF = JSON.stringify(token2);
      let peticion = this.authServices.validateToken(tokenF);
      peticion.subscribe( (resp: tokenModel) => {
        this.usuario = resp.data;
      });
    };
  }
  registrarEvento(idEvento, idUsuario) {
    const usuarioEvento: Object = {
      id_evento : idEvento,
      id_usuario : idUsuario
    };
    const final = JSON.stringify(usuarioEvento);
    const peticion = this._eventoService.registrarEvento(final);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'Ya estas registrado al evento.') {
          Swal.fire({
            title: 'No te puedes registrar!',
            text: 'Ya te encuentras registrado al evento.',
            icon: 'info',
          });
        } else if ( resp.message === 'Haz sido registrado al evento.' ) {
          Swal.fire({
            title: 'Registro exitoso!',
            text: 'Haz sido registrado al evento.',
            icon: 'success',
          });
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'No haz podido ser registrado al evento.',
          text: 'Intenta nuevamente.'
        });
      }
    );
  }

}
