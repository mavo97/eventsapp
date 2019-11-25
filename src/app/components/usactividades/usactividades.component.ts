import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Servivces
import { ActividadService } from '../../services/actividad.service';
import { SalaService } from '../../services/sala.service';
import { AuthService } from '../../services/auth/auth.service';

// Models
import { verActividadesModel } from '../../models/actividad.model';
import { verSalaModel, verSalaModel2 } from '../../models/sala.model';
import { UsuarioModel, tokenModel } from '../../models/usuario.model';
// Alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usactividades',
  templateUrl: './usactividades.component.html',
  styleUrls: ['./usactividades.component.css']
})
export class UsactividadesComponent implements OnInit {
 
  id: number;
  mostrarA: boolean;
  actividades: verActividadesModel = new verActividadesModel();
  salas: verSalaModel = new verSalaModel();
  usuario: UsuarioModel = new UsuarioModel();
  token = localStorage.getItem('jwt');

  constructor( private route: ActivatedRoute,
               private router: Router,
               private actividadService: ActividadService,
               private salaService: SalaService,
               private authService: AuthService ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params.id;
      // console.log(this.id);
    });
    this.buscarActividades();
    this.buscarUsuario();
  }
  buscarActividades() {
    this.actividadService.verActividades(this.id)
    .subscribe( (resp: verActividadesModel) => {
    this.actividades = resp;
    this.mostrarA = true;
    // console.log(this.actividades);
    }, (err) => {
      this.mostrarA = false;
    });
  }
  // Regresar a una pagina anterior
  regresar() {
    this.router.navigate(['eventos/']);
  }
  verSalas(id) {
    this.salaService.verSalas(id)
    .subscribe( (resp: verSalaModel) =>
       this.salas = resp
    , (err) => {
      this.salas = null;
    });
  }

  buscarUsuario() {
    if ( this.token ) {
      const token2: object = {
        jwt: this.token
      };
      const tokenF = JSON.stringify(token2);
      let peticion = this.authService.validateToken(tokenF);
      peticion.subscribe( (resp: tokenModel) => {
        this.usuario = resp.data;

      });
    };
  }
  registrarSala(idSala, idUsuario) {
    const datos: object = {
      id_sala : idSala,
      id_usuario : idUsuario
    };
    const datosF = JSON.stringify(datos);
    const peticion = this.salaService.registrarse(datosF);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'Ya estas registrado a la sala.') {
          Swal.fire({
            title: 'No te puedes registrar!',
            text: 'Ya te encuentras registrado a la sala.',
            icon: 'info',
          });
        } else if ( resp.message === 'Haz sido registrado a la sala.' ) {
          Swal.fire({
            title: 'Registro exitoso!',
            text: 'Haz sido registrado a la sala.',
            icon: 'success',
          });
        }
      }, (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'No haz podido ser registrado a la sala.',
          text: 'Intenta nuevamente.'
        });
      }
    );
  }
}
