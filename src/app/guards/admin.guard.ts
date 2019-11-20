import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  tipoUsuario: string;

  constructor( private auth: AuthService,
    private route: Router ) {}

  canActivate(): boolean {
    this.auth.messageCurrent.subscribe(message => this.tipoUsuario = message);
    if (this.tipoUsuario === 'A' ) {
      return true;
    } else {
      this.route.navigateByUrl('/inicio');
      return false;
    }
  }
  
}
