import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
// Alertas
import Swal from 'sweetalert2';
// Services
import { AuthService } from '../../services/auth/auth.service';
import { tokenModel, UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forma: FormGroup; // Formulario para validar
  verToken: tokenModel = new tokenModel();
  usuario: UsuarioModel = new UsuarioModel;

  constructor( private authService: AuthService,
               private router: Router) {
    this.forma = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.maxLength(30),
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      contrasena: new FormControl('', [Validators.required, Validators.maxLength(20),
      Validators.minLength(6) ]),
    });
   }

  ngOnInit() {
  }

  logIn() {
    // console.log(this.forma);
    const usuario: Object = {
      correo: this.forma.controls.correo.value,
      contrasena: this.forma.controls.contrasena.value
    };
    const usuarioF = JSON.stringify(usuario);
    let peticion: Observable<any>;
    peticion = this.authService.logIn(usuarioF);
    Swal.fire({
      title: 'Espere',
      text: 'Iniciando sesión...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe( resp => {
      localStorage.setItem('jwt', resp.jwt);
      // Obtener información del token
      let peticion2: Observable<any>;
      const token: object = {
        jwt : localStorage.getItem('jwt')
      };
      const tokenF = JSON.stringify(token);
      peticion2 = this.authService.validateToken(tokenF);
      peticion2.subscribe( (resp2: tokenModel) => {
        this.usuario = resp2.data;
        this.authService.changeMessage('Logueado');
        if ( this.usuario.rol_usuario === 'A' ) {
          this.router.navigateByUrl('/admin');
          this.authService.changeMessage2('A');
        } else {
          this.router.navigateByUrl('/eventos');
          this.authService.changeMessage2('U');
        }
        // console.log(this.verToken);
      }, (err2) => {
        Swal.fire({
          icon: 'error',
          title: 'Accesso denegado',
          text: 'Intente de nuevo.'
        });
      });
      // Aquí termina información del token
      Swal.close();
      // 
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Verifique sus datos.'
      });
    });
  }

}
