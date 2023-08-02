import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import localeEsAr from '@angular/common/locales/es-AR';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatMomentAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatChipsModule } from '@angular/material/chips';
import {
  registerLocaleData,
} from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { StoreModule } from '@ngrx/store';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AutomaticDebitComponent } from './components/automatic-debit/automatic-debit.component';
import { ContactComponent } from './components/contact/contact.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TableModule } from 'ngx-easy-table';
import { environment } from '../environments/environment';
import { PaymentConfirmationComponent } from './components/payments/payment-confirmation/payment-confirmation.component';
import { ControlMessagesComponent } from './components/configuration/configuration.control-messages.service';
import { SvgService } from './services/svg.service';
import { TableFeeComponent } from './components/table-fee/table-fee.component';
import { TableAutomaticDebitsComponent } from './components/automatic-debit/table-automatic-debits/table-automatic-debits.component';
import { ConfirAutoDebitsComponent } from './components/automatic-debit/confir-auto-debits/confir-auto-debits.component';
import { DebtPostsComponent } from './components/debt-posts/debt-posts.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AmountConvert } from './util/amountConvert.pipe';
import { QuotationPipe } from './util/quotations.pipe';
import { HttpClientModule } from '@angular/common/http';
import { WINDOW_PROVIDERS } from './../app/core/helpers/window.provider';
import { CookieService } from 'ngx-cookie-service';
import { CoreModule } from '../app/core/core.module';
import { DialogTermsComponent } from './components/shared/dialog-terms/dialog-terms.component';
import { httpInterceptorProviders } from './core/interceptors';
import { ClientsAccountStateComponent } from './components/crm/clients-account-state/clients-account-state.component';
import { CommunicationComponent, NewContactDetailDialogComponent } from './components/crm/communication/communication.component';
import { OverduePaymentDialogComponent } from './components/crm/overdue-payment-dialog/overdue-payment-dialog.component';
import { NewCommunicationDialogComponent } from './components/crm/new-communication-dialog/new-communication-dialog.component';
import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { TemplateIndexComponent } from './components/template-index/template-index.component';
import { SupportComponent } from './components/support/support.component';
import { QuotationsComponent } from './components/crm/quotations/quotations.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ExchangeRateEffects } from './state/exchange-rate.effects';
import { exchangeRateReducer } from './state/exchange-rate.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FrequentQuestionsComponent } from './components/frequent-questions/frequent-questions.component';
import { LastAccessListComponent } from './components/reports/last-access-list/last-access-list.component';
import { RepeatedDebtDetailsListComponent } from './components/reports/repeated-debt-details-list/repeated-debt-details-list.component';
import { RepeatedClientEmailsListComponent } from './components/reports/repeated-client-emails-list/repeated-client-emails-list.component';
import  {ReportRenderAccountComponent } from "./components/reports/report-render-account/report-render-account.component";
import { ReportRejectedSantanderComponent } from "./components/reports/report-rejected-santander/report-rejected-santander.component";

import {AngularEditorModule} from "@kolkov/angular-editor";
import { AccountsComponent } from './components/accounts/accounts.component';
import { DialogConfirmDeleteAccountComponent } from './components/accounts/dialog-confirm-delete-account/dialog-confirm-delete-account.component';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { DialogAddAccountComponent } from './components/dialog-add-account/dialog-add-account.component';
import { AuditoryProfileCurrency } from './components/auditory-currency-profile/auditory-profile-currency-list.component';
import { ProductsComponent } from './components/products/products.component';
import { TableProductComponent } from './components/products/table-product/table-product.component';
import { DialogConfirmDeleteContactDetailComponent } from './components/crm/communication/dialog-confirm-delete-contact-detail/dialog-confirm-delete-contact-detail.component';
import { AdvancePaymentsComponent } from './components/advance-payments/advance-payments.component';
import { TrimValueDirective } from './core/directives/trim-value-accesor.directive';
import { CreatedUserComponent } from './components/created-user/created-user.component';
import { PublishedDebtFilesComponent } from './components/published-debt-files/published-debt-files.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogRestrictClientComponent } from './components/support/dialog-restrict-client/dialog-restrict-client.component';
import { QuotationsTableComponent } from './components/quotations-table/quotations-table.component';
import { DialogDetailsComponent } from './components/summary/dialog-details/dialog-details.component';
import { DetailsTableComponent } from './components/summary/details-table/details-table.component';
import { AppConfigService } from './core/config/AppConfigService';
import { DebtFreeComponent } from './components/debt-free/debt-free.component';
import { ClientsPanelTableComponent } from './components/crm/clients-account-state/clients-panel-table/clients-panel-table.component';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { TourHelpComponent } from './components/tour-help/tour-help.component';
import { PaymentsTourComponent } from './components/payments/payments-tour/payments-tour.component';
import { PaymentsConfirmationTourComponent } from './components/payments/payments-confirmation-tour/payments-confirmation-tour.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReportTableComponent } from './components/reports/report-render-account/report-table/report-table.component';
import { DebinComponent } from './components/debin/debin.component';
import { ConfirmDebinDialogComponent } from './components/debin/confirm-debin-dialog/confirm-debin-dialog.component';
import { DetailsReportTableComponent } from './components/reports/report-render-account/details-report-table/details-report-table.component';
import { FinanceQuotationsHubService } from './services/finance-quotations-hub.service';
import { QuickAccessQuotationsComponent } from './components/quick-access-quotations/quick-access-quotations.component';
import { DateQuotesComponent } from './components/date-quotes/date-quotes.component';
import { PaymentReportsComponent } from './components/payment-reports/payment-reports.component';
import { ManageAdvancePaymentsComponent } from './components/manage-advance-payments/manage-advance-payments.component';
import { ConfirmOrdersStatusComponent } from './components/manage-advance-payments/confirm-orders-status/confirm-orders-status.component';

registerLocaleData(localeEsAr, 'es-Ar');
// This config is needed to format date in material controls
// const MY_FORMATS = {
//   parse: {
//     dateInput: ['LL'],
//   },
//   display: {
//     dateInput: 'D MMM YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
// const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
//   parse: {
//     dateInput: ['LL'],
//   },
//   display: {
//     dateInput: 'D MMM YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY'
//   }
// };

export function initConfig(appConfig: AppConfigService) {
  return () =>  appConfig.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PageNotFoundComponent,
    PaymentsComponent,
    SummaryComponent,
    AutomaticDebitComponent,
    ContactComponent,
    ConfigurationComponent,
    PaymentConfirmationComponent,
    ControlMessagesComponent,
    TableFeeComponent,
    TableAutomaticDebitsComponent,
    ConfirAutoDebitsComponent,
    DialogTermsComponent,
    DebtPostsComponent,
    AmountConvert,
    QuotationPipe,
    ClientsAccountStateComponent,
    CommunicationComponent,
    OverduePaymentDialogComponent,
    NewCommunicationDialogComponent,
    NewContactDetailDialogComponent,
    TemplateEditorComponent,
    TemplateIndexComponent,
    SupportComponent,
    QuotationsComponent,
    UserGuideComponent,
    FrequentQuestionsComponent,
    LastAccessListComponent,
    RepeatedDebtDetailsListComponent,
    RepeatedClientEmailsListComponent,
    ReportRenderAccountComponent,
    ReportRejectedSantanderComponent,
    AuditoryProfileCurrency,
    AccountsComponent,
    DialogConfirmDeleteAccountComponent,
    DialogConfirmDeleteContactDetailComponent,
    DialogInfoComponent,
    DialogAddAccountComponent,
    ProductsComponent,
    TableProductComponent,
    AdvancePaymentsComponent,
    TrimValueDirective,
    CreatedUserComponent,
    PublishedDebtFilesComponent,
    DialogRestrictClientComponent,
    QuotationsTableComponent,
    DialogDetailsComponent,
    DetailsTableComponent,
    DebtFreeComponent,
    ClientsPanelTableComponent,
    ReportTableComponent,
    DetailsReportTableComponent,
    TourHelpComponent,
    PaymentsTourComponent,
    PaymentsConfirmationTourComponent,
    DebinComponent,
    ConfirmDebinDialogComponent,
    QuickAccessQuotationsComponent,
    PaymentReportsComponent,
    ManageAdvancePaymentsComponent,
    ConfirmOrdersStatusComponent,
    DateQuotesComponent
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    CoreModule,
    NgxMaskModule.forRoot(),
    MatSelectFilterModule,
    NgxMatMomentModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatChipsModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('exchangeRate', exchangeRateReducer),
    StoreDevtoolsModule.instrument({
      name: 'Cobra App DevTools',
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([ExchangeRateEffects]),
    AngularEditorModule,
    FlexLayoutModule,
    TourMatMenuModule.forRoot(),
    NgxIntlTelInputModule
  ],
  entryComponents: [
    DialogTermsComponent,
    OverduePaymentDialogComponent,
    NewCommunicationDialogComponent,
    NewContactDetailDialogComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService, FinanceQuotationsHubService],
      multi: true,
    },
    SvgService,
    httpInterceptorProviders,
    { provide: MAT_DATE_LOCALE, useValue: 'es-Ar' },

    // This config is needed to format date in material controls
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },

    // { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false }},
    // { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    // { provide: NgxMatDateAdapter, useClass: NgxMatMomentAdapter, deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]},

    WINDOW_PROVIDERS,
    // provider used to create fake backend
    CookieService
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
