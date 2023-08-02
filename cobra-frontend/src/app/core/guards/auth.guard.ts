import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { User, EPermission } from 'src/app/models';
import { toaster } from '../../app.component';
import { PrincipalService } from '../auth';
import { map } from 'rxjs/operators';
import { Util } from '../util/util';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  currentUser: any;
  currentSSOToken: any;
  shouldShowAdvanceFeeMenu: boolean = null;

  constructor(
    private principalService: PrincipalService,
    private authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.principalService.getIdentity().pipe(map((user: User) => {
      this.currentUser = user;
      if (route.routeConfig.path === "quick-access-quotations") {
        const notClient = this.hasRoleWithName("cliente") && this.currentUser.userRoles.length > 1
        return notClient || !this.currentUser
      }
      
      if (!this.currentUser) {
        return false;
      }

      if (!this.isAllowed(route.data.requiredPermissions, this.currentUser)) {
        this.showNotAllowedToaster();
        return false;
      }

      if (route.routeConfig.path === "advance-payments" && !this.shouldShowAdvanceFee()) {
        this.showNotAllowedToaster();
        return false;
      }

      /* this.utilityService.navigateToLoginSSO(); */
      return true;
    }));
  }

  showNotAllowedToaster() {
    toaster.error(
      'No tiene permisos para acceder a este recurso',
      'No autorizado'
    );
  }

  isAllowed(requiredPermissions: EPermission[], user: User): boolean {
    let accessSeach: boolean = false;
    if (!Util.isNullOrUndefined(user) && !Util.isNullOrUndefined(user.userRoles)) {
      if (!Array.isArray(user.userRoles)) {
        user.userRoles = JSON.parse(user.userRoles);
      }
      accessSeach = requiredPermissions.every(x =>
        user.userRoles.some(y =>
          y.permissions.some(z => z.code == x)
        )
      );
    }

    return accessSeach;
  }

  hasRoleWithName(roleName: string) {
    let hasRole: boolean = false;
    let user = this.currentUser;
    if (!Util.isNullOrUndefined(user) && !Util.isNullOrUndefined(user.userRoles)) {
      if (!Array.isArray(user.userRoles)) {
        user.userRoles = JSON.parse(user.userRoles);
      }
      hasRole = user.userRoles.some(x => x.name.toLowerCase() == roleName.toLowerCase());
    }
    return hasRole;
  }

  shouldShowAdvanceFee() {
    if (this.shouldShowAdvanceFeeMenu !== null) return this.shouldShowAdvanceFeeMenu;

    this.principalService.getIdentity().subscribe(user => {
      this.currentUser = user;
    });

    if (this.hasRoleWithName("admin") || (this.hasRoleWithName("cuentasacobrar") && this.isAllowed([EPermission.Access_AdvancePayments], this.currentUser))) {
      return this.shouldShowAdvanceFeeMenu = true;
    };

    try {
      let buJson = this.authService.getValue('Business_Units');
      if (buJson != '') {
        let businessUnitUser = JSON.parse(buJson);
        this.shouldShowAdvanceFeeMenu = this.validateShowAdvanceFeeMenu(businessUnitUser);
      }
    } catch (e) {
      return false;
    }

    return this.shouldShowAdvanceFeeMenu
  }

  validateShowAdvanceFeeMenu(businessUnitUser: any): boolean {
    var buFilter = ['criba', 'ut huergo']
    if (businessUnitUser == undefined || businessUnitUser.length == 0) return false;
    return businessUnitUser?.length > 1 && businessUnitUser.some(bu => !buFilter.includes(bu?.toLowerCase())) || !buFilter.includes(businessUnitUser[0]?.toLowerCase());
  }

}
