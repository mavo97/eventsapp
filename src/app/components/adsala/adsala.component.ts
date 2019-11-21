import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
// Services
import { SalaService } from '../../services/sala.service';
// Models
import { salaModel, verSalaModel2 } from '../../models/sala.model';
import { userSala } from '../../models/usuario.model';
// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adsala',
  templateUrl: './adsala.component.html',
  styleUrls: ['./adsala.component.css']
})
export class AdsalaComponent implements OnInit {

  constructor( private route: ActivatedRoute,
               private salaService: SalaService ) {
                                 // Validar formulario crear sala
              this.forma = new FormGroup({
                nombre: new FormControl('',   [
                  Validators.required, Validators.maxLength(30)
                ]),
                ubicacion: new FormControl('', [Validators.required, Validators.maxLength(30)]),
                status: new FormControl('', [Validators.required, Validators.maxLength(5)]),
                id_actividad: new FormControl('', [Validators.required])
              });
                }

  id: number; // Id sala
  sala: salaModel = new salaModel();
  edit = false; // Variable para ocultar o mostrar formulario editar
  forma: FormGroup; // Formulario editar sala
  usuarios: verSalaModel2;
  mostrarU;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params.id;
      // console.log(this.id);
    });
    this.leerSala();
  }
  // Leer sala
  leerSala() {
    this.salaService.leerSala(this.id)
    .subscribe( (resp: salaModel ) => {
      this.sala = resp;
      this.forma.controls.nombre.setValue(this.sala.nombre);
      this.forma.controls.ubicacion.setValue(this.sala.ubicacion);
      this.forma.controls.status.setValue(this.sala.estado);
      this.forma.controls.id_actividad.setValue(this.sala.id_actividad);
      this.usuariosensala(this.sala.id_sala);
      // console.log(this.sala);
    });
  }
  usuariosensala(id) {
    this.salaService.usuariosenSala(id)
    .subscribe( (resp: verSalaModel2 ) => {
      this.usuarios = resp;
      this.mostrarU = true;
    }, (err) => {
      this.mostrarU = false;
    });
  }
  baja(idUsuario, idSala) {
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
                text: 'Fue dado de baja correctamente.',
                icon: 'success',
              });
              this.leerSala();
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
  editar() {
    this.edit = true;
  }
  // Ocultar formulario
  noeditar() {
    this.edit = false;
  }

  // Regresar una pagina atrás
  return() {
    window.history.back();
  }

  // Actualizar sala
  updateSala( form: NgForm ) {
    const id2 = this.id.toString();
    const salaU: salaModel = {
      id_sala: id2,
      nombre: this.forma.value.nombre,
      estado: this.forma.value.status,
      ubicacion: this.forma.value.ubicacion,
      id_actividad: this.forma.value.id_actividad
    };
    const sala2 = JSON.stringify(salaU);
    let peticion: Observable<any>;
    peticion = this.salaService.actualizarSala(sala2);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'La sala fue actualizada.') {
          Swal.fire({
            title: 'La sala ' + this.forma.value.nombre + '.',
            text: 'Fue actualizada correctamente.',
            icon: 'success',
          });
          this.leerSala();
          this.edit = false;
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar la sala.',
          text: 'Verifica los datos.'
        });
      }
    );
  }
}
