import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { toaster } from '../../app.component';

@Injectable({ providedIn: 'root' })
export class UtilityService {

    constructor(private router: Router) {}

    navigate(path: string) {
        this.router.navigate([path]);
    }

    navigateToLogin() {
        this.navigate('/login');
    }

    navigateToLoginSSO() {
        toaster.info(
            'Necesita loguearse para poder acceder. Redireccionando...',
            'No autorizado'
        );      
      window.location.assign(environment.loginSSOURL);
    }

    navigateToError() {
        this.navigate('/error');
    }

    navigateToHome(user: any) {

        try {
            let userRoles = JSON.parse(user.userRoles);
            let hasRoleClient = userRoles.some(x => x.name.toLowerCase() == 'cliente');
            
            setTimeout(() => {
                  if (this.router.url !== "/quick-access-quotations"){
                    hasRoleClient ? this.navigate('/summary') : this.navigate('/payments');
                  }
                }, 1000)
          } catch (err) {
            console.log(err);
            this.navigate('/');
          }

    }

    // navigateToBack() {
    //     // this.navigate(this.history.previousUrl);
    // }

    reloadPage() {
        window.location.reload();
    }

    /* getNow(outputFormat?: string): string {
        return moment().format(outputFormat || 'DD/MM/YYYY');
    } */

}
