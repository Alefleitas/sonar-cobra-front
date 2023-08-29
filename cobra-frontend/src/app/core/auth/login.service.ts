import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrincipalService } from './principal.service';
import { UtilityService } from '../services/utility.service';
import { AuthService } from './auth.service';
import { Login, Token } from '../../models';

@Injectable({ providedIn: 'root' })
export class LoginService {

    constructor(
        private utilityService: UtilityService,
        private principalService: PrincipalService,
        private authService: AuthService
    ) {}

    login(loginModel: Login): Observable<Token> {
        return this.authService.login(loginModel);
    }

    logout() {
        this.authService.logout();
        this.principalService.cleanAuthentication();
        this.utilityService.navigateToLoginSSO();
    }

     logout2() {
        this.authService.logout();
        this.principalService.cleanAuthentication();
        this.utilityService.navigateToLoginSSO();
    }
}
