import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Clubes } from '../clubes/clubes';


@Component({
  selector: 'app-top',
  standalone: false,
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent implements OnInit {


  nomeUsuario?: string;
  emailUsuario?: string;
  
  clube?: string;
  dropdownVisible = false; // Controle do estado do dropdown
  
  isAuthenticated = false;

  constructor(private authService: AuthService) {}


  ngOnInit() {
    this.preencheDados()
  }

  logout(){
    this.authService.logout();
  }

  toggleSidebar() {
    const body = document.querySelector('body');
    if (body) {
      body.classList.toggle('toggle-sidebar');
    }
  }

  preencheDados(){

    this.emailUsuario = this.authService.getEmail();
    this.nomeUsuario = this.authService.getNome();
    this.clube = Clubes[this.authService.getGrupos()[0]];
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
    this.preencheDados()
  }
}

