import { Component, OnInit } from '@angular/core';
// Services
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaService } from '../../services/sala.service';

// Models
import { verEventosModel, EventModel } from '../../models/evento.model';
import { UsuarioModel, tokenModel, dataUserModel } from '../../models/usuario.model';
import { verSalaModel, verSalaModel2 } from '../../models/sala.model';


@Component({
  selector: 'app-useventos',
  templateUrl: './useventos.component.html',
  styleUrls: ['./useventos.component.css']
})
export class UseventosComponent implements OnInit {

  eventos: verEventosModel = new verEventosModel(); // Array de eventos
  usuario: UsuarioModel = new UsuarioModel();
  mostrarA: boolean;
  ver: string;
  token = localStorage.getItem('jwt');
  mostrarB: boolean;
  userSalas: verSalaModel2 = new verSalaModel2();



  constructor( private eventoService: EventoService,
               private authServices: AuthService,
               private router: Router,
               private salaService: SalaService ) { }

  ngOnInit() {
    this.buscarUsuario();
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
        // console.log(this.usuario);
        this.leerMisEventos(this.usuario.id_usuario);
        this.usuarioSalas(this.usuario.id_usuario);
      });
    };
  }
  usuarioSalas(id) {
    this.salaService.usuarioSalas(id)
    .subscribe( (resp: verSalaModel2) => {
       this.userSalas = resp;
       console.log(this.userSalas);
       this.mostrarB = true;
      }, (err) => {
      this.mostrarB = false;
    });
  }
  leerMisEventos( id ) {
    this.eventoService.usuarioEvento(id)
    .subscribe( (resp: verEventosModel ) => {
      this.eventos = resp;
      this.mostrarA = true;
      console.log(this.eventos);
      // console.log(this.eventos);
    }, (error) => {
      this.mostrarA = false;
      // console.log(error);
    });
  }
  verActividades(id) {
    this.router.navigate(['actividades/', id]);
  }
}
