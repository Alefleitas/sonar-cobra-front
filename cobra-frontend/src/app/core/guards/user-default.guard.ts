import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PrincipalService } from '../auth';
import { Role, User, ERole } from 'src/app/models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserDefaultGuard implements CanActivate {

    currentUser: any;

    constructor(private router: Router,
        private principalService: PrincipalService
    ) { }

    canActivate() {

       return this.principalService.getIdentity().pipe(map((user: User) => {
            this.currentUser = user;


            if (!this.currentUser) {
                return false;
            }

            var defaultPage;
            if (typeof this.currentUser.userRoles === 'string' || this.currentUser.userRoles instanceof String){
                defaultPage = this.getDefaultPageByRoles(JSON.parse(this.currentUser.userRoles));
            }
            else{
                defaultPage = this.getDefaultPageByRoles(this.currentUser.userRoles)
            }
            if (!!defaultPage) {
                this.router.navigate([defaultPage]);
            } else {
                return true;
            }
        }));
    }

    public getDefaultPageByRoles(roles: Array<Role>): string {
        if (roles.some(x => x.name.toLowerCase() == ERole[ERole.Admin].toLowerCase()) 
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.Comercial].toLowerCase())
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.Cliente].toLowerCase()))
            return "/payments";
        else if (roles.some(x => x.name.toLowerCase() == ERole[ERole.CuentasACobrar].toLowerCase()) 
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.Legales].toLowerCase())
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.Externo].toLowerCase())
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.Criba].toLowerCase())
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.AtencionAlCliente].toLowerCase())
        || roles.some(x => x.name.toLowerCase() == ERole[ERole.ObrasParticulares].toLowerCase()))
            return "/accounts-state";
        else if (roles.some(x => x.name.toLowerCase() == ERole[ERole.Soporte].toLowerCase()))
            return "/support";
        else
            return "/not-found";
    }

}