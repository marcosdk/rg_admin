import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { DocumentosComponent } from './pages/documentos/documentos.component'; 
import { DocumentosEditComponent } from './pages/documentos-edit/documentos-edit.component';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';
import { AuthGuard } from './services/guard/auth.guard';
import { AuthCallbackComponent } from './componentes/auth-callback/auth-callback.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent,  canActivate: [AuthGuard] },
  { path: 'documentos', component: DocumentosComponent ,  canActivate: [AuthGuard]},
  { path: 'documentos/:id', component: DocumentosEditComponent,  canActivate: [AuthGuard]},
  { path: 'auth-callback', component: AuthCallbackComponent } // Callback
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
