import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
// Alertas
import Swal from 'sweetalert2';
// Models
import { UsuarioModel } from '../../models/usuario.model';
// Services
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  forma: FormGroup; // Formulario para validar

  constructor( private usuarioService: UsuarioService ) {
    this.forma = new FormGroup({
      nombre: new FormControl('', [ Validators.required, Validators.maxLength(30) ]),
      apellidos: new FormControl('', [ Validators.required, Validators.maxLength(30) ]),
      telefono: new FormControl('', [ Validators.required, Validators.maxLength(10),
      Validators.minLength(10) ]),
      correo: new FormControl('', [Validators.required, Validators.maxLength(30),
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      rol_usuario: new FormControl('U', [Validators.required, Validators.maxLength(1)]),
      contrasena: new FormControl('', [Validators.required, Validators.maxLength(20),
      Validators.minLength(6) ]),
      contrasena2: new FormControl()
    });
    this.forma.controls.contrasena2.setValidators(
      [this.noIgual.bind(this.forma), Validators.required, Validators.maxLength(20),
        Validators.minLength(6)]
    );
   }

  ngOnInit() {
  }
  // Validar password
  noIgual(control: FormControl ):{ [s: string]: boolean} {
    let forma: any = this;

    if (forma.controls.contrasena2.value !== forma.controls['contrasena'].value) {
      return {
        noiguales: true
      };
    }
    return null;
  }
  guardarUsuario( forma: NgForm ) {
    // console.log(this.forma);
    const usuario: UsuarioModel = {
      nombre: this.forma.value.nombre,
      apellidos: this.forma.value.apellidos,
      telefono: this.forma.value.telefono,
      correo: this.forma.value.correo,
      contrasena: this.forma.value.contrasena2,
      rol_usuario: this.forma.value.rol_usuario
    };
    const usuarioF = JSON.stringify(usuario);
    let peticion: Observable<any>;
    peticion = this.usuarioService.crearUsuario(usuarioF);
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información...',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    peticion.subscribe(
      resp => {
        if (resp.message === 'Cuenta creada correctamente.') {
          Swal.fire({
            title: 'Cuenta creada.',
            text: 'Su cuenta fue creada exitosamente.',
            icon: 'success',
          });
          // Reset Formulario
          this.forma.reset({
            nombre: '',
            apellidos: '',
            correo: '',
            telefono: '',
            contrasena: '',
            contrasena2: ''
          });

        } else if ( resp.message === 'El correo ya esta registrado.') {
          Swal.fire({
            title: 'El correo ya se encuentra registrado.',
            text: 'Favor de poner otro correo.',
            icon: 'info',
          });
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error al crear su cuenta.',
          text: 'Intente más tarde.'
        });
      }
    );

  }
}
