import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { RequestService } from '../services/request.service';
import { User } from '../../models';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AccountService {
  currentUserSubject: any;
  public currentUser: Observable<User>;
  public user: User;

  constructor(
    private requestService: RequestService,
    private cookieService: CookieService
  ) { }

  get(): Observable<User> {

    if (this.cookieService.get('Consultatio_Cobra_Token').length !== 0) {
      this.user = new User();
      this.user  = jwt_decode(this.cookieService.get('Consultatio_Cobra_Token'));
      this.user.popUp = false;
      this.currentUserSubject = new BehaviorSubject<User>(this.user);
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('Consultatio_Cobra_Token')));
    }
    this.currentUser = this.currentUserSubject.asObservable();

    return this.currentUser;
  }

  save(user: User): Observable<User> {
    return this.requestService.post('api/user', user);
  }

}
