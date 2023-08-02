import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { SvgService } from './services/svg.service';
import { CookieService } from 'ngx-cookie-service';
export let toaster: ToastrService;
import * as moment from 'moment';
import { ERole, Login } from './models';
import { LoginService, PrincipalService } from './core/auth';
import { UtilityService } from './core/services';
import { MatDialog } from '@angular/material/dialog';
/* NgRx */
import { Store } from '@ngrx/store';
import { State } from './state';
import { ExchangeRatePageActions } from './state/actions';
import { PaymentService } from './services/payment.service';
import * as _ from 'lodash';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { Router } from '@angular/router';

moment.locale('es-Ar');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
  mostrar: boolean;
  currentUser: any;
  isLoading: any;
  currentSSOToken: any;
  authenticationError: any;
  title = 'cobra-frontend';
  time: any;
  intervalId: any;
  quotationAccess: boolean = false;

  constructor(
    private store: Store<State>,
    public dialog: MatDialog,
    private toasterService: ToastrService,
    private svgService: SvgService,
    private cookieService: CookieService,
    private loginService: LoginService,
    private principalService: PrincipalService,
    private utilityService: UtilityService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    toaster = toasterService;
    this.svgService.init();
    this.intervalId = setInterval(() => {
      this.time = moment().format('DD MMMM YYYY - hh:mm:ss A');
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  ngOnInit(): void {
    this.toasterService.overlayContainer = this.toastContainer;
    this.principalService.authenticated = false;
    this.isLoading = true;
    this.principalService.getIdentity().subscribe(resp => {
      this.currentUser = resp;
    });

    if (!this.currentUser) {
      if (this.cookieService.get('accessToken')) {
        this.loginByToken();
      } else {
        setTimeout(
          () => {
            this.isLoading = false;
            this.router.url !== "/quick-access-quotations" ? this.utilityService.navigateToLoginSSO() : this.quotationAccess = true;
            ;
          }, 1000)
      }
    } else {
      this.isLoading = false;
      this.getExchangeRates();
      if(this.currentUser)
      this.getBusinessUnits();
      this.utilityService.navigateToHome(this.currentUser);
    }
  }

  ngAfterViewInit(){}

  get isClient(): boolean {
    return this.currentUser && this.currentUser.userRoles?.length
      && _.some(JSON.parse(this.currentUser.userRoles), r => r.name.toLowerCase() === ERole[ERole.Cliente].toLowerCase());
  }

  getExchangeRates() {
    this.store.dispatch(ExchangeRatePageActions.loadUvaExchangeRate());
    this.store.dispatch(ExchangeRatePageActions.loadUsdExchangeRate());
    this.store.dispatch(ExchangeRatePageActions.loadCacExchangeRate());
  }

  loginByToken() {
    if (this.cookieService.get('accessToken')) {
      let model: Login;
      this.loginService.login(model = {
        token: this.cookieService.get('accessToken')
      }).subscribe(
        () => {
          this.isLoading = false;
          this.authenticationError = false;
          this.principalService.authenticated = true;
          this.getExchangeRates();

          this.principalService.getIdentity().subscribe(user => {
            if (this.currentUser == null) this.currentUser = user;
            this.getBusinessUnits();
            this.utilityService.navigateToHome(user);
          });
        },
        () => {
          if (this.router.url === "/quick-access-quotations"){
            this.isLoading = false;
            this.authenticationError = false;
            this.principalService.authenticated = true;
          } else {
            this.authenticationError = true;
            this.loginService.logout();
          }
        });
    }
  }


  getBusinessUnits(){
    if (this.isClient) {
      this.paymentService.getBUListForClient().subscribe(
        (res: any) => {
            this.cookieService.set('Business_Units', JSON.stringify(res));
        },
        error => {
          console.log(error);
          this.cookieService.set('Business_Units', '[]');
        }
      );
    }
  }


 openDialog(): void {
      const dialogRef = this.dialog.open(DialogInfoComponent, {
        maxWidth: '450px',
        panelClass: 'dialog-responsive',
        data: {
          title: 'Novedades',
          text: 'Nuevo diseño, más intuitivo y organizado. Ahora también permite abonar en dólares en forma inmediata. Se requiere el ingreso al Homebanking para confirmar el débito.',
          icon: 'error',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

