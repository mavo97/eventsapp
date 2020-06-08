import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
// Alertas
import Swal from 'sweetalert2';
// Models
import { UsuarioModel } from '../../models/usuario.model';
import { AlumnoModel } from '../../models/alumno.model';
import { PersonalModel } from '../../models/personal.model';
import { ExternoModel } from '../../models/externo.model';

// Services
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formaP: FormGroup; formaA: FormGroup; formaE: FormGroup; // Formularios para validar
  divExterno: boolean; divPersonal: boolean; divAlumno: boolean;
  alumno: AlumnoModel = new AlumnoModel();
  personal: PersonalModel = new PersonalModel();
  externo: ExternoModel = new ExternoModel();

  constructor( private usuarioService: UsuarioService ) {
    this.validarPersonalForm(); this.validarAlumnoForm(); this.validarExternoForm();
   }

  ngOnInit() {
  }
  // Validar password
  noIgual(control: FormControl ): { [s: string]: boolean} {
    const formaP: any = this;
    if (formaP.controls.contrasena2.value !== formaP.controls['contrasena'].value) {
      return {
        noiguales: true
      };
    }
    return null;
  }

  // Registrar Personal
  guardarPersonal( formaP: NgForm ) {
    this.personal.nombre = this.formaP.value.nombreP; this.personal.apellidos = this.formaP.value.apellidoP;
    this.personal.rfc = this.formaP.value.rfc; this.personal.correo = this.formaP.value.correo;
    this.personal.ocupacion = this.formaP.value.ocupacion; this.personal.telefono = this.formaP.value.telefono;
    this.personal.departamento = this.formaP.value.departamento; this.personal.contrasena = this.formaP.value.contrasena2;
    this.personal.rol_usuario = 'P';
    console.log(this.personal);
  }

  // Registrar Alumno
  guardarAlumno( formaA: NgForm ) {
    this.alumno.nombre = this.formaA.value.nombreA; this.alumno.apellidos = this.formaA.value.apellidoA;
    this.alumno.no_control = this.formaA.value.nocontrol; this.alumno.correo = this.formaA.value.correo;
    this.alumno.carrera = this.formaA.value.carrera; this.alumno.telefono = this.formaA.value.telefono;
    this.alumno.contrasena = this.formaA.value.contrasena2; this.alumno.rol_usuario = 'U';
    console.log(this.alumno);
  }

  // Registrar externo
  guardarExterno( formaE: NgForm  ) {
    this.externo.nombre = this.formaE.value.nombreE; this.externo.apellidos = this.formaE.value.apellidoE;
    this.externo.correo = this.formaE.value.correo; this.externo.telefono = this.formaE.value.telefono;
    this.externo.contrasena = this.formaE.value.contrasena2; this.externo.rol_usuario = 'E';
    this.externo.direccion = this.formaE.value.direccion;
    console.log(this.externo);
  }

  validarPersonalForm() {
    this.formaP = new FormGroup({ nombreP: new FormControl('', [ Validators.required, Validators.maxLength(30) ]),
    apellidoP: new FormControl('', [ Validators.required, Validators.maxLength(30)]),
    telefono: new FormControl('', [ Validators.required, Validators.maxLength(10), Validators.minLength(10),
      Validators.pattern('^(0|[1-9][0-9]*)$') ]),
    rfc: new FormControl('', [ Validators.required, Validators.maxLength(15)]),
    correo: new FormControl('', [ Validators.required, Validators.maxLength(50),
       Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ]),
    ocupacion: new FormControl('', [ Validators.required, Validators.maxLength(30)]),
    departamento: new FormControl('', [ Validators.required, Validators.maxLength(30)]),
    contrasena: new FormControl('', [ Validators.required ]),
    contrasena2: new FormControl( )
   });
    this.formaP.controls.contrasena2.setValidators(
    [ this.noIgual.bind(this.formaP), Validators.required ]
  );
  }

  validarAlumnoForm() {
    this.formaA = new FormGroup({ nombreA: new FormControl('', [ Validators.required, Validators.maxLength(30) ]),
    apellidoA: new FormControl('', [ Validators.required, Validators.maxLength(30)]),
    telefono: new FormControl('', [ Validators.required, Validators.maxLength(10), Validators.minLength(10),
      Validators.pattern('^(0|[1-9][0-9]*)$') ]),
    correo: new FormControl('', [ Validators.required, Validators.maxLength(50),
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ]),
    nocontrol: new FormControl('', [ Validators.required, Validators.maxLength(8), Validators.minLength(8) ]),
    carrera: new FormControl('', [ Validators.required, Validators.maxLength(40)]),
    contrasena: new FormControl('', [ Validators.required ]),
    contrasena2: new FormControl()
    });
    this.formaA.controls.contrasena2.setValidators(
      [ this.noIgual.bind(this.formaA), Validators.required ]);
  }

  validarExternoForm() {
    this.formaE = new FormGroup({ nombreE: new FormControl('', [ Validators.required, Validators.maxLength(30) ]),
    apellidoE: new FormControl('', [ Validators.required, Validators.maxLength(30)]),
    telefono: new FormControl('', [ Validators.required, Validators.maxLength(10), Validators.minLength(10),
      Validators.pattern('^(0|[1-9][0-9]*)$') ]),
    correo: new FormControl('', [ Validators.required, Validators.maxLength(50),
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ]),
    direccion: new FormControl('', [ Validators.required, Validators.maxLength(30)]),
    contrasena: new FormControl('', [ Validators.required ]),
    contrasena2: new FormControl()
     });
    this.formaE.controls.contrasena2.setValidators(
    [ this.noIgual.bind(this.formaE), Validators.required ]);
  }
}
