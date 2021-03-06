import { Component, OnInit } from '@angular/core';
// Services
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaService } from '../../services/sala.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

// Models
import { verEventosModel, EventModel } from '../../models/evento.model';
import { UsuarioModel, tokenModel, dataUserModel } from '../../models/usuario.model';
import { verSalaModel, verSalaModel2 } from '../../models/sala.model';
import { Alert } from '../../models/alerta.model';

// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-useventos',
  templateUrl: './useventos.component.html',
  styleUrls: ['./useventos.component.css']
})
export class UseventosComponent implements OnInit {

  eventos: verEventosModel = new verEventosModel(); // Array de eventos
  usuario: UsuarioModel = new UsuarioModel();
  mostrarA: boolean;
  ver: string; myGroup: FormGroup;
  token = localStorage.getItem('jwt');
  mostrarB: boolean;
  userSalas: verSalaModel2 = new verSalaModel2();
  alerta: Alert = new Alert();

  constructor( private eventoService: EventoService,
               private authServices: AuthService,
               private router: Router,
               private salaService: SalaService,
               // tslint:disable-next-line: variable-name
               private _eventoService: EventoService,
               private usuarioService: UsuarioService ) {

                this.myGroup = new FormGroup({
                  contrasena: new FormControl('', [ Validators.required ]),
                  contrasena2: new FormControl()
                });
                this.myGroup.controls.contrasena2.setValidators(
                  [ this.noIgual.bind(this.myGroup), Validators.required ]);
               }

  ngOnInit() {
    this.buscarUsuario();
  }

  noIgual(control: FormControl ): { [s: string]: boolean} {
    const myGroup: any = this;
    if (myGroup.controls.contrasena2.value !== myGroup.controls['contrasena'].value) {
      return {
        noiguales: true
      };
    }
    return null;
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

  baja(idUsuario, idEvento) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const id_usuario: Object  = {
      id_usuario : idUsuario,
      id_evento : idEvento
    };
    const idjson = JSON.stringify(id_usuario);
    console.log(idjson);
    Swal.fire({
      title: '¿Está seguro de querer dar de baja a este usuario?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja!'
    }).then((result) => {
      if (result.value) {
        peticion = this._eventoService.bajaUsuario(idjson);
        Swal.fire({
          title: 'Espere',
          text: 'Procesando baja...',
          icon: 'info',
          allowOutsideClick: false
        });
        Swal.showLoading();
        peticion.subscribe(
          resp => {
            if (resp.message === 'El usuario fue dado de baja.') {
              Swal.fire({
                title: 'El usuario.',
                text: 'Has sido dado de baja.',
                icon: 'success',
              });
              this.leerMisEventos(idUsuario);
            }
           },
          (err) => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Error al querer dar de baja al usuario.',
              text: 'Intenta más tarde...'
            });
          }
        );
      }
    });
  }

  baja2(idUsuario, idSala) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const id_usuario: Object  = {
      id_usuario : idUsuario,
      id_sala : idSala
    };
    const idjson = JSON.stringify(id_usuario);
    console.log(idjson);
    Swal.fire({
      title: '¿Está seguro de querer dar de baja a este usuario?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja!'
    }).then((result) => {
      if (result.value) {
        peticion = this.salaService.bajaUsuario(idjson);
        Swal.fire({
          title: 'Espere',
          text: 'Procesando baja...',
          icon: 'info',
          allowOutsideClick: false
        });
        Swal.showLoading();
        peticion.subscribe(
          resp => {
            if (resp.message === 'El usuario fue dado de baja.') {
              Swal.fire({
                title: 'El usuario.',
                text: 'Has sido dado de baja.',
                icon: 'success',
              });
              this.usuarioSalas(idUsuario);
            }
           },
          (err) => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Error al querer dar de baja al usuario.',
              text: 'Intenta más tarde...'
            });
          }
        );
      }
    });
  }

  guardarContrasena( idUsuario ) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const usuario_contrasena: Object  = {
      id_usuario : idUsuario,
      contrasena : this.myGroup.value.contrasena2
    };
    const idjson = JSON.stringify(usuario_contrasena);
    peticion = this.usuarioService.cambiarContrasena(idjson);
    peticion.subscribe( resp => {
      if ( resp.message === 'Contrasena actualizada correctamente.' ) {

        this.alerta.exito('Éxito', 'Contrasena actualizada correctamente.' );
        this.myGroup.reset({ contrasena: '', contrasena2: '' });

      } },
      (err) => {

        this.alerta.error('Intente más tarde.', 'Hubo un error al intentar actualizar su contraseña.');

      } );
  }
}
