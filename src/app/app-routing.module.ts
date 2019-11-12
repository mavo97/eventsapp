import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdeventComponent } from './components/adevent/adevent.component';
import { AdactivitieComponent } from './components/adactivitie/adactivitie.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'admin/evento/:id', component: AdeventComponent},
  { path: 'admin/actividad/:id', component: AdactivitieComponent},
  { path: '**', pathMatch: 'full', redirectTo: '' }
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