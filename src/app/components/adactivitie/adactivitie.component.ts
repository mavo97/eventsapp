import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
// Services
import { ActividadService } from '../../services/actividad.service';
// Models
import { ActividadModel } from '../../models/actividad.model';
// Alertas
import Swal from 'sweetalert2';

import * as moment from 'moment';

@Component({
  selector: 'app-adactivitie',
  templateUrl: './adactivitie.component.html',
  styleUrls: ['./adactivitie.component.css']
})
export class AdactivitieComponent implements OnInit {

  constructor( private route: ActivatedRoute,
               private actividadService: ActividadService ) {

                this.forma = new FormGroup({
                  nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
                  fecha_inicio: new FormControl(''),
                  fecha_fin: new FormControl('', [Validators.required, this.dateVaidator ]),
                  id_evento: new FormControl('', Validators.required ),
                  descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)])
                });

                this.forma.controls.fecha_inicio.setValidators([
                  Validators.required, this.dateVaidator
                ]);
                }

  id: number; // Id actividad
  activity: ActividadModel = new ActividadModel(); // Actividad que se esta editando
  edit = false; // Variable para ocultar o mostrar formulario editar
  forma: FormGroup; // Formulario editar actividad


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.leerActividad();
  }

  leerActividad() {
    this.actividadService.leerActividad(this.id)
    .subscribe( (resp: ActividadModel ) => {
      this.activity = resp;
      this.forma.controls.nombre.setValue(this.activity.nombre);
      this.forma.controls.fecha_inicio.setValue(this.activity.fecha_inicio);
      this.forma.controls.fecha_fin.setValue(this.activity.fecha_fin);
      this.forma.controls.id_evento.setValue(this.activity.id_evento);
      this.forma.controls.descripcion.setValue(this.activity.descripcion);
      console.log(this.activity);
      console.log(this.id);
      // console.log(this.event);
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
  updateActividad( form: NgForm ) {
    const id2 = this.id.toString();
    const actividadU: ActividadModel = {
      id_actividad: id2,
      nombre: this.forma.value.nombre,
      fecha_inicio: this.forma.value.fecha_inicio,
      fecha_fin: this.forma.value.fecha_fin,
      id_evento: this.forma.value.id_evento,
      descripcion: this.forma.value.descripcion
    };
    const actividad2 = JSON.stringify(actividadU);
    console.log(actividad2);
    let peticion: Observable<any>;
    peticion = this.actividadService.actualizarActividad(actividad2);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'La actividad fue actualizada.') {
          Swal.fire({
            title: 'La actividad ' + this.forma.value.nombre + '.',
            text: 'Fue actualizada correctamente.',
            icon: 'success',
          });
          this.leerActividad();
          this.edit = false;
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar la actividad.',
          text: 'Verifica los datos.'
        });
      }
    );
  }
  // Funcion para no permitir ceros
  noCero(control: FormControl ): {[s: string]: boolean} {
    const forma: any = this;
    const val = forma.controls.costo.value;
    if (val === '0' || val === '00' || val === '000' || val === '0000' || val === '00000') {
      return {
        noCeros: true
      };
    }
    return null;
  }
  dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'YYYY-MM-DD', true).isValid()) {
      return { dateVaidator: true };
    }
    return null;
  }
}
