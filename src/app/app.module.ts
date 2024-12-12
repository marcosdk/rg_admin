import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopComponent } from './componentes/top/top.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentosComponent } from './pages/documentos/documentos.component';
import { DocumentosEditComponent } from './pages/documentos-edit/documentos-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    DocumentosComponent,
    DocumentosEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
