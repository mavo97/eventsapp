import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
// Services
import { EventoService } from '../../services/evento.service';
import { ActividadService } from '../../services/actividad.service';
// Models
import { EventModel, verUsEvento, UsuarioEventoModel } from '../../models/evento.model';
import { ActividadModel, verActividadesModel } from '../../models/actividad.model';
// Alertas
import Swal from 'sweetalert2';

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
  edit = false; // Variable para ocultar o mostrar formulario editar
  forma2: FormGroup; // Formulario crear actividad
  actividades: verActividadesModel = new verActividadesModel();
  mostrarA: boolean;
  mostrarB: boolean;
  userEventos;

  constructor( private route: ActivatedRoute,
               // tslint:disable-next-line: variable-name
               private _eventoService: EventoService,
               private actividadService: ActividadService,
               private router: Router ) {
    // Validar formulario
    this.forma = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      fecha_inicio: new FormControl(''),
      fecha_fin: new FormControl('', [Validators.required, this.dateVaidator ]),
      ubicacion: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      costo: new FormControl(''),
      status: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      cupo: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+') ])
    });

    this.forma.controls.costo.setValidators([
      Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+')
    ]);
    this.forma.controls.fecha_inicio.setValidators([
      Validators.required, this.dateVaidator
    ]);

    this.forma2 = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      fecha_inicio: new FormControl(''),
      fecha_fin: new FormControl('', [Validators.required, this.dateVaidator ]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(200)])
    });

    this.forma2.controls.fecha_inicio.setValidators([
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
    this.callActivities();
    this.usuarioEventos();

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
      this.forma.controls.cupo.setValue(this.event.cupo);
      // console.log(this.event);
    });
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
  // funcion para actualizar evento
  updateEvento( form: NgForm ) {
    const id2 = this.id.toString();
    const eventU: EventModel = {
      id_evento: id2,
      nombre: this.forma.value.nombre,
      fecha_inicio: this.forma.value.fecha_inicio,
      fecha_fin: this.forma.value.fecha_fin,
      ubicacion: this.forma.value.ubicacion,
      costo: this.forma.value.costo,
      estado: this.forma.value.status,
      descripcion: this.forma.value.descripcion,
      cupo: this.forma.value.cupo
        };
    const evento2 = JSON.stringify(eventU);
    let peticion: Observable<any>;
    peticion = this._eventoService.actualizarEvento(evento2);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'El evento fue actualizado.') {
          Swal.fire({
            title: 'El evento ' + this.forma.value.nombre + '.',
            text: 'Fue actualizado correctamente.',
            icon: 'success',
          });
          this.readEvent();
          this.edit = false;
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el evento.',
          text: 'Verifica los datos.'
        });
      }
    );
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
      return { dateVaidator: true };
    }
    return null;
  }
  // Regresar una pagina atrás
  return() {
    window.history.back();
  }

  // Crear actividad
  crearActividad() {
    console.log(this.forma2);
    const actividad: ActividadModel = {
      nombre: this.forma2.value.nombre,
      fecha_inicio: this.forma2.value.fecha_inicio,
      fecha_fin: this.forma2.value.fecha_fin,
      descripcion: this.forma2.value.descripcion,
      id_evento: this.id.toString()
    };
    const actividad2 = JSON.stringify(actividad);
    // console.log(actividad2);
    let peticion: Observable<any>;
    peticion = this.actividadService.crearActividad(actividad2);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'La actividad fue creada.') {
          Swal.fire({
            title: 'La actividad ' + this.forma2.value.nombre + '.',
            text: 'Fue creada.',
            icon: 'success',
          });
          this.callActivities();
          // Reset Formulario
          this.forma2.reset({
            nombre: '',
            fecha_inicio: '',
            fecha_fin: '',
            descripcion: ''
          });
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la actividad.',
          text: 'Verifica los datos'
        });
        // console.log(err);
      }
    );
  }
  callActivities() {
    this.actividadService.verActividades( this.id )
    .subscribe((resp: verActividadesModel) => {
      this.actividades.records = resp.records;
      // console.log(this.actividades);
      this.mostrarA = true;
    }, (error) => {
      this.mostrarA = false;
      // console.log(error);
    });
    // console.log(this.id);
  }
  // Editar actividad
  editarActividad( id ) {
    // console.log(id);
    this.router.navigate(['admin/actividad', id]);
  }
  // Eliminar Actividad
  eliminarActividad(id: number) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const id_actividad: Object  = {
      id_actividad: id
    };
    const idjson = JSON.stringify(id_actividad);
    Swal.fire({
      title: '¿Está seguro de querer eliminar la actividad?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar actividad!'
    }).then((result) => {
      if (result.value) {
        peticion = this.actividadService.eliminarActividad(idjson);
        Swal.fire({
          title: 'Espere',
          text: 'Eliminando evento...',
          icon: 'info',
          allowOutsideClick: false
        });
        Swal.showLoading();
        peticion.subscribe(
          resp => {
            if (resp.message === 'La actividad fue eliminada.') {
              Swal.fire({
                title: 'La actividad.',
                text: 'Fue eliminado correctamente.',
                icon: 'success',
              });
              this.readEvent();
              this.callActivities();
            }
           },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la actividad.',
              text: 'Intenta más tarde...'
            });
          }
        );
      }
    });
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
                text: 'Fue dado de baja correctamente.',
                icon: 'success',
              });
              this.readEvent();
              this.callActivities();
              this.usuarioEventos();
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
  usuarioEventos() {
    this._eventoService.usuarioEventos(this.id)
    .subscribe( ( resp: verUsEvento ) => {
       this.userEventos = resp;
       console.log(this.userEventos);
       this.mostrarB = true;
      }, (err) => {
      this.mostrarB = false;
    });
  }

}