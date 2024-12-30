import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { inject } from '@angular/core';


@Component({
  selector: 'app-top',
  standalone: false,
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent implements OnInit {


  private readonly oidcSecurityService = inject(OidcSecurityService);

  nomeUsuario?: string;
  emailUsuario?: string;
  
  isAuthenticated = false;

  constructor(private authService: AuthService) {}


  ngOnInit() {

    this.oidcSecurityService.checkAuth().subscribe((dados) => {

      if (dados.isAuthenticated) {
        this.emailUsuario = dados.userData.email;
        this.nomeUsuario = dados.userData.name;
       
       
     
      }
    });

  }
}

