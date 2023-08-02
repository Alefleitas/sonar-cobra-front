import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { RequestService } from '../services/request.service';
import { Login } from '../../models';
import { User } from '../../models/index';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public currentUser: Observable<User>;
  public currentSSOToken: Observable<string>;

  constructor(
    private storageService: StorageService,
    private requestService: RequestService,
    private cookieService: CookieService,
  ) {
  }

  getToken(): string {
    return this.storageService.getToken();
  }
  getSourceToken(): string {
    return this.storageService.getSourceToken();
  }


  setValue(key: string, value: string){
    this.storageService.store(key, value);
  }

  getValue(key: string): string {
    return this.storageService.get(key);
  }

  login(loginModel: Login): Observable<any> {
    return this.requestService.get('login/login/').pipe(
      map((result: any) => {
        this.storeAuthenticationToken(result);
      }));
  }

  public storeAuthenticationToken(jwt: string) {
    this.storageService.storeToken(jwt);
  }

  public storeAuthenticationSourceToken(jwt:string) {
    this.storageService.storeSourceToken(jwt);
  }

  public clearBuToken() {
    this.storageService.clearBuToken();
  }

  logout() {
    this.storageService.clearToken();
  }

}
