import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';




@Injectable({
  providedIn: 'root',
})
export class AuthService {

    email?: string;
    nome?: string ;
    grupos: string[] = [];

    public isAuthenticated: Observable<boolean>;

    constructor(private oidcSecurityService: OidcSecurityService) {
        // Atualizar estado de autenticação baseado no fluxo do OIDC
        this.isAuthenticated = this.oidcSecurityService.isAuthenticated$.pipe(
            map((auth) => auth.isAuthenticated) // Extraindo o valor booleano

    );

    }
    
    setEmail(email: string): void {
        this.email = email;
    }
    
    getEmail(): string  {

        this.oidcSecurityService.checkAuth().subscribe((dados) => {
            
            if (dados.isAuthenticated) {
                this.email = dados.userData.email;
            }
        });
        return this.email ?? '';
    }


    setNome(nome: string): void {
        this.nome = nome;
    }
    
    getNome(): string  {

        this.oidcSecurityService.checkAuth().subscribe((dados) => {
            
            if (dados.isAuthenticated) {
                this.nome = dados.userData.name;
            }
        });        
        return this.nome ?? '';
    }

    setGrupos(grupos: string[]): void {
        this.grupos = grupos;
    }

    getGrupos(): string[] {


        this.oidcSecurityService.checkAuth().subscribe((dados) => {
              
            if (dados.isAuthenticated) {
               
                const idToken = dados.idToken;
        
                // Decodifica o ID token manualmente
                const payloadBase64 = idToken.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
        
                console.log('Token decodificado:', decodedPayload);
                const gruposDec = decodedPayload['cognito:groups'];
                this.grupos =gruposDec;
            }        
        });

        return this.grupos;
    }

    login() {
        console.log("logando");
        this.oidcSecurityService.authorize();
    }

    public logout() {
        
        this.oidcSecurityService.logoff();

        // Clear session storage
        if (window.sessionStorage) {
            window.sessionStorage.clear();
        }

        window.location.href = environment.urlLogOut; 
        
        
    }

    get estaAutenticado() {
        return this.oidcSecurityService.isAuthenticated$;
    }

    get userData() {
        return this.oidcSecurityService.userData$;
    }

    

}
