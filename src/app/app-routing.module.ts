import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { DocumentosComponent } from './pages/documentos/documentos.component'; 
import { DocumentosEditComponent } from './pages/documentos-edit/documentos-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'documentos', component: DocumentosComponent },
  { path: 'documentos/:id', component: DocumentosEditComponent },
  //{ path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
