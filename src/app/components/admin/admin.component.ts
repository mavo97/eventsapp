import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// Models
import { verEventosModel } from '../../models/evento.model';
// Selects
import { months, days } from './datetime.component';
// Services
import { EventoService } from '../../services/evento.service';
// Alertas
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  forma: FormGroup;
  eventsarray: verEventosModel = new verEventosModel();


  mesess = months;
  diass = days;
  // tslint:disable-next-line: variable-name
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
    this.callEvents();
  }

  callEvents() {
    this._eventoService.verEventos()
    .subscribe((resp: verEventosModel) => {
      this.eventsarray.records = resp.records;
    });
  }

  editar(id: number) {
    console.log(`id: ${id} del evento a editar`);
  }

  eliminar(id: number) {
    console.log(`id: ${id} del evento a editar`);
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


