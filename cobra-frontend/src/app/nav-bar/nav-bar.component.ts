import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthService, LoginService, PrincipalService } from '../core/auth';
import { appRoutes } from '../app-routing.module';
import { AuthGuard } from '../core/guards';
import { paymentsGuide } from '../util/user-guides';
/* NgRx */
import { Store } from '@ngrx/store';
import { State, getUsdExchangeRate, getUVAExchangeRate, getCACExchangeRate, getError } from '../state';
import * as moment from 'moment';
import { NavigationEnd, Router } from '@angular/router';
import { Menu } from '../models/menu.model';
import { MenuService } from './menu.service';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { AppConfigService } from '../core/config/AppConfigService';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentUser: UserNav;
  currentTokenSSO: string;
  currentUserSubject: BehaviorSubject<User>;
  instructions: any;
  opened: boolean = false;
  usdExchangeRate$: Observable<number>;
  uvaExchangeRate$: Observable<number>;
  cacExchangeRate$: Observable<number>;
  errorMessage$: Observable<string>;


  menuSistema: Menu[] = MenuService.menuSistema;
  menuUsuario: Menu[] = MenuService.menuUsuario;

  time: any;
  intervalId: any;
  submenuSelected: string = "";

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  cartelCotizacion: {mostrar: boolean, texto: string};

  constructor(
    private breakpointObserver: BreakpointObserver,
    private principalService: PrincipalService,
    private loginService: LoginService,
    private authGuard: AuthGuard,
    private store: Store<State>,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private appConfigService: AppConfigService
  ) {
    this.intervalId = setInterval(() => {
      this.time = moment().format('DD/MM/YYYY - HH:mm:ss');
    }, 1000);
    this.cartelCotizacion = this.appConfigService.getConfig().cartelCotizacion;
  }

  ngOnInit() {
    this.principalService.getIdentity().subscribe((user: UserNav) => {
      this.currentUser = _.cloneDeep(user);
    });
    this.usdExchangeRate$ = this.store.select(getUsdExchangeRate);
    this.uvaExchangeRate$ = this.store.select(getUVAExchangeRate);
    this.cacExchangeRate$ = this.store.select(getCACExchangeRate);
    this.errorMessage$ = this.store.select(getError);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))  
      .subscribe((event: NavigationEnd) => {
          this.menuSistema[1].submenus.filter(e => e.link === event.url).length > 0 ? this.submenuSelected = "Pagos" : null;
          this.menuSistema[3].submenus.filter(e => e.link === event.url).length > 0 ? this.submenuSelected = "Administración" : null;
          this.menuSistema[4].submenus.filter(e => e.link === event.url).length > 0 ? this.submenuSelected = "Reportes" : null;
      });

  }

  shouldShow(route: string): boolean {
    const data = appRoutes.find(x => x.path === route).data;
    const requiredPermissions = data ? data.requiredPermissions : [];

    return this.authGuard.isAllowed(
      requiredPermissions ? requiredPermissions : [],
      this.currentUser
    );
  }

  shouldShowMenu(menu: Menu): boolean {
    let shouldShow = true;
    if (menu.link) {
      let route = menu.link.substring(1);
      shouldShow = this.shouldShow(route);
      if (route === "advance-payments"){
        shouldShow = this.authGuard.shouldShowAdvanceFee();
      }
      if (route === "quick-access-quotations"){
        const notClient = this.authGuard.hasRoleWithName("cliente") && this.currentUser.userRoles.length > 1
        shouldShow = notClient
      }
    }
    return shouldShow;
  }

  shouldShowMenuWithSubmenu(menu: Menu): boolean {
    let shouldShow = false;

    for (var i = 0; i < menu.submenus.length; i++) {
      let route = menu.submenus[i].link.substring(1);
      if (this.shouldShow(route)) {
        shouldShow = true;
        break;
      }
    }

    return shouldShow;
  }

  logout() {
    this.loginService.logout();
  }


  handleMenuUsuario(menu: Menu, sidenav: any) {
    sidenav?.toggle();
    if (!menu.link) {
      this.logout();
    }
  }

  loginWithSourceToken() {
    let sourceToken = this.authService.getSourceToken();
    this.authService.storeAuthenticationToken(sourceToken);
    window.location.reload();
  }

  showInstructions(page: string) {
    switch (page) {
      case 'payments':
        this.instructions = paymentsGuide;
        break;
    }
  }

  _closeInstructions() {
    this.opened = false;
  }

  determineMenuBtnContainer(menu) {
    const filteredMenuItems = this.menuSistema.filter(x => this.shouldShowMenu(x))
                                              .map(x => x.title)
                                              .filter(x => x === "Preguntas frecuentes" || x === "Contacto");
    return filteredMenuItems.indexOf(menu.title) === 0 ? 'menuContainerRight' : 'menuContainer';
  }

  checkQuotationsScreen(){
    return !this.cookieService.get('accessToken') && this.router.url === "/quick-access-quotations"
  }
}

// FIX MUY RARO !!
class UserNav extends User {
  firstname:string;
}
