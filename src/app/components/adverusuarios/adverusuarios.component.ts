import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { UsuarioService } from '../../services/usuario.service';
// Models
import { dataUserModel2 } from '../../models/usuario.model';
// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adverusuarios',
  templateUrl: './adverusuarios.component.html',
  styleUrls: ['./adverusuarios.component.css']
})
export class AdverusuariosComponent implements OnInit {
  
  usuarios: dataUserModel2 = new dataUserModel2();

  constructor( private usuarioService: UsuarioService ) { }

  ngOnInit() {
    this.readUsers();
  }
  readUsers(){
    this.usuarioService.readUsers().subscribe(
      (resp : dataUserModel2 ) => {
        console.log(resp);
        this.usuarios = resp;
      }
    );
  }
  baja(idUsuario) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const id_usuario: Object  = {
      id_usuario : idUsuario
    };
    const idjson = JSON.stringify(id_usuario);
    console.log(idjson);
    Swal.fire({
      title: '¿Está seguro de querer eliminar a este usuario?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        peticion = this.usuarioService.eliminarUsuario(idjson);
        Swal.fire({
          title: 'Espere',
          text: 'Procesando...',
          icon: 'info',
          allowOutsideClick: false
        });
        Swal.showLoading();
        peticion.subscribe(
          resp => {
            if (resp.message === 'El usuario fue eliminado.') {
              Swal.fire({
                title: 'El usuario.',
                text: 'Fue eliminado.',
                icon: 'success',
              });
              this.readUsers();
            }
           },
          (err) => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Error al querer eliminar al usuario.',
              text: 'Intenta más tarde...'
            });
          }
        );
      }
    });
  }
}
