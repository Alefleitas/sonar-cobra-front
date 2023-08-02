import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AccountService } from './account.service';
import { UtilityService } from './../services/utility.service';
import { User } from '../../models';

@Injectable({ providedIn: 'root' })
export class PrincipalService {

  private userIdentity: User;
  authenticationState = new Subject<User>();

  authenticated = true;

  constructor(
    private utilityService: UtilityService,
    private accountService: AccountService
    ) {
    this.authenticationState.next(this.userIdentity);
  }

  cleanAuthentication() {
    this.userIdentity = undefined;
    this.authenticated = false;
    this.authenticationState.next(this.userIdentity);
  }

  SetPopUp(bol:  boolean) {
    this.userIdentity.popUp = bol;
    this.authenticationState.next(this.userIdentity);
  }

  SetTcUsd(valor: string) {
    this.userIdentity.tcUsd = valor;
    this.authenticationState.next(this.userIdentity);
  }

  SetTcUva(valor: string) {
    this.userIdentity.tcUva = valor.toString();
    this.authenticationState.next(this.userIdentity);
  }

  getIdentity(): Observable<User> {
    this.authenticationState.next(this.userIdentity);

    if (this.userIdentity) {
      this.authenticationState.next(this.userIdentity);
      return of(this.userIdentity);
    }

    return this.accountService.get().pipe(
      tap(
        result => {
          this.userIdentity = result;
          this.authenticated = true;
          this.authenticationState.next(this.userIdentity);
        },
        () => {
          this.userIdentity = undefined;
          this.authenticated = false;
          this.authenticationState.next(this.userIdentity);
          this.utilityService.navigateToLoginSSO();
        }
      )
    );
  }

  getAuthenticationState(): Observable<User> {
    return this.authenticationState.asObservable();
  }

}
