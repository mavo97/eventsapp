import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
// Services
import { EventoService } from '../../services/evento.service';
// Models
import { EventModel } from '../../models/evento.model';

import * as moment from 'moment';

@Component({
  selector: 'app-adevent',
  templateUrl: './adevent.component.html',
  styleUrls: ['./adevent.component.css']
})
export class AdeventComponent implements OnInit {

  id: number; // Id evento
  event: EventModel = new EventModel(); // Evento que se esta editando
  forma: FormGroup; // Formulario editar evento
  edit: boolean = false; // Variable para ocultar o mostrar formulario editar



  constructor( private route: ActivatedRoute,
               private _eventoService: EventoService ) {
    // Validar formulario
    this.forma = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      fecha_inicio: new FormControl(''),
      fecha_fin: new FormControl('', [Validators.required, this.dateVaidator ]),
      ubicacion: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      costo: new FormControl(''),
      status: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)])
    });

    this.forma.controls.costo.setValidators([
      Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+'),
      this.noCero.bind(this.forma)
    ]);
    this.forma.controls.fecha_inicio.setValidators([
      Validators.required, this.dateVaidator
    ]);

                }


  ngOnInit() {
    // Obtener id de la url
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    // Leer el evento actual
    this.readEvent();

  }

  // Funcion para leer el evento actual
  readEvent() {
    this._eventoService.leerEvento(this.id)
    .subscribe( (resp: EventModel ) => {
      this.event = resp;
      this.forma.controls.nombre.setValue(this.event.nombre);
      this.forma.controls.fecha_inicio.setValue(this.event.fecha_inicio);
      this.forma.controls.fecha_fin.setValue(this.event.fecha_fin);
      this.forma.controls.costo.setValue(this.event.costo);
      this.forma.controls.ubicacion.setValue(this.event.ubicacion);
      this.forma.controls.descripcion.setValue(this.event.descripcion);
    });
  }
  // Funcion para no permitir ceros
  noCero(control: FormControl ):{[s: string]: boolean} {
    const forma: any = this;
    const val = forma.controls.costo.value;
    if (val === '0' || val === '00' || val === '000' || val === '0000' || val === '00000') {
      return {
        noCeros: true
      };
    }
    return null;
  }
  // funcion para actualizar evento
  updateEvento( form: NgForm ) {
    console.log(this.forma);
    if ( form.invalid ) {
      console.log('Formulario Invalido!!');
      return; }
  }
  // Mostrar formulario
  editar() {
    this.edit = true;
  }
  // Ocultar formulario
  noeditar() {
    this.edit = false;
  }
  // Validar fecha
  dateVaidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'YYYY-MM-DD', true).isValid()) {
      return { 'dateVaidator': true };
    }
    return null;
  }
}
