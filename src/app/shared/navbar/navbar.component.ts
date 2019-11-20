import { Component, OnInit, DoCheck } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../../services/auth/auth.service';
import { tokenModel, UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, DoCheck{

  verToken: tokenModel = new tokenModel();
  usuario: UsuarioModel = new UsuarioModel();
  token = localStorage.getItem('jwt');
  uLogueado: string;
  ver: string;

  constructor( private authServices: AuthService ) { }

  ngOnInit() {
    this.buscarUsuario();
    this.authServices.tipoUsuario();
  }
  ngDoCheck() {
    this.authServices.currentMessage.subscribe(message => this.uLogueado = message);
    this.authServices.messageCurrent.subscribe(message => this.ver = message);
    }

  buscarUsuario() {
    if ( this.token ) {
      
      const token2: object = {
        jwt: this.token
      };
      const tokenF = JSON.stringify(token2);
      let peticion = this.authServices.validateToken(tokenF);
      peticion.subscribe( (resp: tokenModel) => {
        this.usuario = resp.data;
      });
    };
  }
  logOut() {
    this.authServices.logOut();
    this.authServices.changeMessage('NoLogueado');
    this.authServices.changeMessage2('');
  }

}
