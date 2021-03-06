import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// Models
import { verEventosModel } from '../../models/evento.model';
import { EventoModel } from '../../models/evento2.model';
// Services
import { EventoService } from '../../services/evento.service';
// Alertas
import Swal from 'sweetalert2';

import * as moment from 'moment';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  forma: FormGroup; // Formulario para validar
  eventsarray: verEventosModel = new verEventosModel(); // Array de eventos
  eventsarray2: verEventosModel = new verEventosModel(); // Array de eventos
  mostrarA; eventoR: EventoModel = new EventoModel(); mostrarC;

  // tslint:disable-next-line: variable-name
  constructor( private _eventoService: EventoService,
               private _route: Router ) {

    // Validar formulario crear evento
    this.forma = new FormGroup({
      nombre: new FormControl('',   [
        Validators.required, Validators.maxLength(30)
      ]),
      fecha_inicio: new FormControl('', [Validators.required, this.dateVaidator ]),
      fecha_fin: new FormControl('', [Validators.required, this.dateVaidator ]),
      ubicacion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      costo: new FormControl(''),
      status: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      cupo: new FormControl('', ([ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+')]))
    });

    this.forma.controls.costo.setValidators([
      Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+')
    ]);
  }

  ngOnInit() {
    // Llamada de eventos
    this.callEvents();
  }

  // Validador para campo fecha
  dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'YYYY-MM-DD', true).isValid()) {
      return { 'dateVaidator': true };
    }
    return null;
  }

  // Funcion para llamar a los eventos
  callEvents() {
    this._eventoService.verEventos()
    .subscribe((resp: verEventosModel) => {
      this.eventsarray.records = resp.records;
      this.mostrarA = true;
    }, (error) => {
      this.mostrarA = false;
      // console.log(error);
    });
  }

  // Funcion para llamar historial de eventos
  historial() {
    this._eventoService.verHistorial()
    .subscribe((resp: verEventosModel) => {
      this.eventsarray2.records = resp.records;
      this.mostrarC = true;
    }, (error) => {
      this.mostrarC = 'e';
      // console.log(error);
    });
  }

  // Ocultar historial
  ocultar() { this.mostrarC = false; this.mostrarC = ''; }
  // Editar evento
  editar(id: number) {
    // console.log(`id: ${id} del evento a editar`);
    this._route.navigate(['admin/evento', id]);
  }

  // Eliminar evento
  eliminar(id: number) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const id_evento: Object  = {
      id_evento: id
    };
    const idjson = JSON.stringify(id_evento);
    Swal.fire({
      title: '¿Está seguro de querer eliminar el evento?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar evento!'
    }).then((result) => {
      if (result.value) {
        peticion = this._eventoService.eliminarEvento(idjson);
        Swal.fire({
          title: 'Espere',
          text: 'Eliminando evento...',
          icon: 'info',
          allowOutsideClick: false
        });
        Swal.showLoading();
        peticion.subscribe(
          resp => {
            if (resp.message === 'El evento fue eliminado.') {
              Swal.fire({
                title: 'El evento ' + this.forma.value.nombre + '.',
                text: 'Fue eliminado correctamente.',
                icon: 'success',
              });
              this.callEvents(); }
           },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el evento.',
              text: 'Intenta más tarde...'
            });
          }
        );
      }
    });
  }

  // Validador para no permitir ceros en el campo costo
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

  // Funcion guardar evento
  guardarEvento() {
    // console.log(this.forma);
    // console.log(this.forma.value);
    // Objecto evento

    this.eventoR.nombre = this.forma.value.nombre;
    this.eventoR.fecha_inicio = this.forma.value.fecha_inicio;
    this.eventoR.fecha_fin = this.forma.value.fecha_fin;
    this.eventoR.ubicacion = this.forma.value.ubicacion;
    this.eventoR.costo = this.forma.value.costo;
    this.eventoR.estado = this.forma.value.status;
    this.eventoR.descripcion = this.forma.value.descripcion;
    this.eventoR.cupo = this.forma.value.cupo;

    // Convertir objeto evento a JSON
    const evento2 = JSON.stringify(this.eventoR);
    console.log(evento2);

    let peticion: Observable<any>;
    peticion = this._eventoService.crearEvento(evento2);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'El evento fue creado.') {
          Swal.fire({
            title: 'El evento ' + this.forma.value.nombre + '.',
            text: 'Fue creado.',
            icon: 'success',
          });
          this.callEvents();
          // Reset Formulario
          this.forma.reset({
            nombre: '',
            fecha_inicio: '',
            fecha_fin: '',
            ubicacion: '',
            costo: '',
            status: '',
            descripcion: ''
          });

        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el evento.',
          text: 'Verifica los datos'
        });
      }
    );

  }
}


