import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// Selects
import { months, days } from './datetime.component';
// Services
import { EventoService } from '../../services/evento.service';
// Alertas
import Swal from 'sweetalert2';
import { Config } from 'protractor';
import { ArrayType } from '@angular/compiler';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  forma: FormGroup;
  eventsarray: any;

  mesess = months;
  diass = days;
  constructor( private _eventoService: EventoService) {

    this.forma = new FormGroup({
      nombre: new FormControl('',   [
        Validators.required,
        Validators.minLength(3)
      ]),
      fecha_inicio: new FormGroup({
        dia: new FormControl('', Validators.required),
        mes: new FormControl('', Validators.required),
        year: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]+')])
      }),
      fecha_fin: new FormGroup({
        diaf: new FormControl('', Validators.required),
        mesf: new FormControl('', Validators.required),
        yearf: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]+')])
      }),
      ubicacion: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      costo: new FormControl(''),
      status: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)])
    });

    this.forma.controls.costo.setValidators([
      Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+'),
      this.noCero.bind(this.forma)
    ]);
  }

  ngOnInit() {
    this._eventoService.verEventos()
    .subscribe(resp => {
      this.eventsarray = resp.records
      
    });
    
  }

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

  guardarEvento() {
    // console.log(this.forma);
    // console.log(this.forma.value);
    const fecha1 = this.forma.value.fecha_inicio.year + '-' + this.forma.value.fecha_inicio.mes + '-' + this.forma.value.fecha_inicio.dia;
    const fecha2 = this.forma.value.fecha_fin.yearf + '-' + this.forma.value.fecha_fin.mesf + '-' + this.forma.value.fecha_fin.diaf;
    const evento: object = {
      nombre: this.forma.value.nombre,
      fecha_inicio: fecha1.replace(/\s/g, ''),
      fecha_fin: fecha2.replace(/\s/g, ''),
      ubicacion: this.forma.value.ubicacion,
      costo: this.forma.value.costo,
      estado: this.forma.value.status,
      descripcion: this.forma.value.descripcion
    }
    const evento2 = JSON.stringify(evento);
    console.log(evento2);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;
    peticion = this._eventoService.crearEvento(evento2);
    peticion.subscribe( resp => {
      console.log(resp);
      if ( resp.message === 'El evento fue creado.' ) {
        this._eventoService.verEventos()
    .subscribe(resp => {
      this.eventsarray = resp.records
      
    });
        Swal.fire({
          title: 'El evento ' + this.forma.value.nombre + '.',
          text: 'Fue creado.',
          icon: 'success',
        });
        this.forma.reset({
          nombre: '',
          fecha_inicio: {
            dia: '',
            mes: '',
            year: ''
          },
          fecha_fin: {
            diaf: '',
            mesf: '',
            yearf: ''
          },
          ubicacion: '',
          costo: '',
          status: '',
          descripcion: ''
        })
      } else {
        Swal.fire({
          title: 'El evento ' + this.forma.value.nombre + '.',
          text: 'No se pudo crear.',
          icon: 'error',
        });
      }
    });

  }
}


