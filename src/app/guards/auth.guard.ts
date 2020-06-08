import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  tipoUsuario: string;

  constructor( private auth: AuthService,
    private route: Router ) {}

  canActivate(): boolean {
    this.auth.messageCurrent.subscribe(message => this.tipoUsuario = message);
    if (this.tipoUsuario === 'U' || 'P' || 'E' ) {
      return true;
    } else {
      this.route.navigateByUrl('/inicio');
      return false;
    }
  }
}
