import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'pc_admin';
 
  
  isAuthenticated = false;

  constructor(private oidcSecurityService: OidcSecurityService) {
    
  }
  

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      console.log('Autenticado:', isAuthenticated);
      console.log('Dados do usuário:', userData);
    });
  }

  login(): void {
    this.oidcSecurityService.authorize(); // Inicia o fluxo de login
  }

  logout(): void {
    console.warn('Acionou o logout ');

    this.oidcSecurityService.logoff(); // Faz logout

    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
                            
    window.location.href = "https://sa-east-1lmvo8wuca.auth.sa-east-1.amazoncognito.com/login?client_id=ichsuho5jf6lerglnh08fhj5k&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fd2jwpu4p6sa7z9.cloudfront.net"; 

  }

}
