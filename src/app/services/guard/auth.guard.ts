import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
  })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate() {

      console.log('canActivate');
      return this.authService.isAuthenticated.pipe(
        map((isAuthenticated) => {
          if (!isAuthenticated) {
            console.log('chama login()');
            this.authService.login();
            console.log('saiu login()');
            return false;
          }
          return true;
        })
      );
    }
  }
  