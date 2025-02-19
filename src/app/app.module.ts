import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {AuthModule} from 'angular-auth-oidc-client';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopComponent } from './componentes/top/top.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentosComponent } from './pages/documentos/documentos.component';
import { DocumentosEditComponent } from './pages/documentos-edit/documentos-edit.component';
import { AuthConfigModule } from './auth/auth-config.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './http-token.interceptor';
import { AuthCallbackComponent } from './componentes/auth-callback/auth-callback.component';
import { environment } from '../environments/environment';
import { PhoneFormatPipe } from './componentes/phone-format/phone-format.pipe';
import { CpfFormatPipe } from './componentes/cpf-format/cpf-format.pipe';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    DocumentosComponent,
    DocumentosEditComponent,
    AuthCallbackComponent,
    CpfFormatPipe,
    PhoneFormatPipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    AuthConfigModule,
    NgxMaskDirective,
    AuthModule.forRoot({
      config: {
        authority: 'https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_ukbz1G50a',
        //redirectUrl: 'https://d2xifqim8uhfbn.cloudfront.net/auth-callback',
        //redirectUrl: 'http://localhost:4200/auth-callback',
        redirectUrl:environment.AuthRedirectUrl,
        postLogoutRedirectUri: window.location.origin,
        clientId: '7mti6kj1asbe4acqufmt84hnp1',
        scope: 'email openid phone profile',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        // Configuração para Português Brasil
        customParamsAuthRequest: {
          ui_locales: 'pt-BR', // Configura o idioma preferencial
        }
      },
    }) 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
