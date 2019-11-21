import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Modulos
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Componentes
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdeventComponent } from './components/adevent/adevent.component';
// Traduccion al español
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AdactivitieComponent } from './components/adactivitie/adactivitie.component';
import { AdsalaComponent } from './components/adsala/adsala.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { UseventosComponent } from './components/useventos/useventos.component';
import { UsactividadesComponent } from './components/usactividades/usactividades.component';
import { FooterComponent } from '../app/shared/footer/footer.component';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AdminComponent,
    AdeventComponent,
    AdactivitieComponent,
    AdsalaComponent,
    RegistroComponent,
    LoginComponent,
    UseventosComponent,
    UsactividadesComponent,
    FooterComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
