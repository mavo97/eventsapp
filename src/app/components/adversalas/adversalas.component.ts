import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { SalaService } from '../../services/sala.service';
// Models
import { readAll } from '../../models/sala.model';
// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adversalas',
  templateUrl: './adversalas.component.html',
  styleUrls: ['./adversalas.component.css']
})
export class AdversalasComponent implements OnInit {
  
  mostrarA: boolean;
  salas: readAll = new readAll ();
  
  constructor( private salaService: SalaService,
               private router: Router ) { 

  }
  
  ngOnInit() {
    this.readAll();
  }
  editarSala( id ) {
    // console.log(id);
    this.router.navigate(['admin/sala', id]);
  }
  // Eliminar sala
  eliminarSala(id: number) {
    let peticion: Observable<any>;
    // tslint:disable-next-line: variable-name
    const id_sala: Object  = {
      id_sala: id
    };
    const idjson = JSON.stringify(id_sala);
    Swal.fire({
      title: '¿Está seguro de querer eliminar la sala?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar sala!'
    }).then((result) => {
      if (result.value) {
        peticion = this.salaService.eliminarSala(idjson);
        Swal.fire({
          title: 'Espere',
          text: 'Eliminando sala...',
          icon: 'info',
          allowOutsideClick: false
        });
        Swal.showLoading();
        peticion.subscribe(
          resp => {
            if (resp.message === 'La sala fue eliminada.') {
              Swal.fire({
                title: 'La sala.',
                text: 'Fue eliminada correctamente.',
                icon: 'success',
              });
              this.readAll();
            }
           },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la sala.',
              text: 'Intenta más tarde...'
            });
          }
        );
      }
    });
  }
  readAll() {
    this.salaService.readAll().subscribe(
      (resp: readAll) => {
        console.log(resp);
        this.salas = resp;
        this.mostrarA = true;
      }, err => {
        this.mostrarA = false;
      }
    );
  }
}
