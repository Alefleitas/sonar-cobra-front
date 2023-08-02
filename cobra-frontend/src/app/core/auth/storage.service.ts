import { Injectable, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { WINDOW } from '../helpers/window.provider';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor(
    private cookieService: CookieService,
    @Inject(WINDOW) protected window: Window,
  ) { }

  getToken(): string {
    return this.cookieService.get('Consultatio_Cobra_Token');
  }

  getTokenSSO(): string {
    return this.cookieService.get('accessToken');
  }

  getSourceToken(): string {
    return this.cookieService.get('Source_Consultatio_Cobra_Token')
  }

  storeToken(jwt: string) {
    this.cookieService.set(
      'ActiveSession',
      'false',
      7
    );
    this.cookieService.set(
      'Consultatio_Cobra_Token',
      jwt,
      7,
      '/',
      this.getDomain(),
      false,
      'Lax'
    );
  }

  storeSourceToken(jwt: string) {
    this.cookieService.set(
      'Source_Consultatio_Cobra_Token',
      jwt,
      7,
      '/',
      this.getDomain(),
      false,
      'Lax'
    );
  }

  storeTokenSso(jwt: string) {
    this.cookieService.set(
      'accessToken',
      jwt,
      7,
      '/',
      this.getDomain(),
      false,
      'Lax'
    );
  }

  storeTokenRefresh(jwt: string) {
    this.cookieService.set(
      'refreshToken',
      jwt,
      7,
      '/',
      this.getDomain(),
      false,
      'Lax'
    );
  }


  store(key: string, value: string) {
    this.cookieService.set(
      key,
      value,
      7,
      '/',
      this.getDomain(),
      false,
      'Lax'
    );
  }

  get(key: string): string{
    return this.cookieService.get(key);
  }

  clearToken() {
    this.cookieService.delete('Consultatio_Cobra_Token', '/', this.getDomain());
    this.cookieService.delete('Consultatio_Cobra_Token');
    this.cookieService.delete('accessToken', '/', this.getDomain());
    this.cookieService.delete('accessToken');
    this.clearBuToken();

    this.cookieService.deleteAll();
  }

  clearBuToken() {
    this.cookieService.delete('Business_Units', '/', this.getDomain());
    this.cookieService.delete('Business_Units');
  }

  getDomain(): string {
    let domain: string;
    if (this.window.location.hostname.split('.').length !== 4) {
      domain =
        '.' +
        this.window.location.hostname
          .split('.')
          .slice(-2)
          .join('.');
    } else {
      return this.window.location.hostname;
    }
    return this.deleteCobraString(domain.substring(1));
  }

  deleteCobraString(dominio: string): string {
    if (dominio.substring(0, 6) === '.cobra') {
      dominio = dominio.substring(6);
    }
    return dominio;
  }

}
