import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdeventComponent } from './components/adevent/adevent.component';
import { AdactivitieComponent } from './components/adactivitie/adactivitie.component';
import { AdsalaComponent } from './components/adsala/adsala.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { UseventosComponent } from './components/useventos/useventos.component';
import { UsactividadesComponent } from './components/usactividades/usactividades.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/evento/:id', component: AdeventComponent, canActivate: [AdminGuard] },
  { path: 'admin/actividad/:id', component: AdactivitieComponent, canActivate: [AdminGuard] },
  { path: 'admin/sala/:id', component: AdsalaComponent, canActivate: [AdminGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'eventos', component: UseventosComponent, canActivate: [AuthGuard] },
  { path: 'actividades/:id', component: UsactividadesComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }