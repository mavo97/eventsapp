import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
// Services
import { SalaService } from '../../services/sala.service';
// Models
import { salaModel } from '../../models/sala.model';
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params.id;
      console.log(this.id);
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
      console.log(this.sala);
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
