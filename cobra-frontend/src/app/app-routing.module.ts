import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentsComponent } from './components/payments/payments.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AutomaticDebitComponent } from './components/automatic-debit/automatic-debit.component';
import { ContactComponent } from './components/contact/contact.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { AuthGuard, UserDefaultGuard } from './..//app/core/guards/index';
/* import { AuthGuard } from './../app/guards/auth.guard'; */
import { EPermission } from './models/role';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentConfirmationComponent } from './components/payments/payment-confirmation/payment-confirmation.component';
import { DebtPostsComponent } from './components/debt-posts/debt-posts.component';
import { ClientsAccountStateComponent } from './components/crm/clients-account-state/clients-account-state.component';
import { CommunicationComponent } from './components/crm/communication/communication.component';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { TemplateIndexComponent } from './components/template-index/template-index.component';
import { SupportComponent } from './components/support/support.component';
import { environment } from 'src/environments/environment';
import { QuotationsComponent } from './components/crm/quotations/quotations.component';
import { FrequentQuestionsComponent } from './components/frequent-questions/frequent-questions.component';
import {LastAccessListComponent} from "./components/reports/last-access-list/last-access-list.component";
import { AccountsComponent } from './components/accounts/accounts.component';
import { AdvancePaymentsComponent } from './components/advance-payments/advance-payments.component';
import { ProductsComponent } from './components/products/products.component';
import { QuotationsTableComponent } from './components/quotations-table/quotations-table.component';
import { RepeatedDebtDetailsListComponent } from './components/reports/repeated-debt-details-list/repeated-debt-details-list.component';
import { RepeatedClientEmailsListComponent } from './components/reports/repeated-client-emails-list/repeated-client-emails-list.component';
import { ReportRejectedSantanderComponent } from './components/reports/report-rejected-santander/report-rejected-santander.component';
import { ReportRenderAccountComponent } from './components/reports/report-render-account/report-render-account.component';
import { CreatedUserComponent } from './components/created-user/created-user.component';
import { PublishedDebtFilesComponent } from './components/published-debt-files/published-debt-files.component';
import { DebtFreeComponent } from './components/debt-free/debt-free.component';
import { DebinComponent } from './components/debin/debin.component';
import { QuickAccessQuotationsComponent } from './components/quick-access-quotations/quick-access-quotations.component';
import { PaymentReportsComponent } from './components/payment-reports/payment-reports.component';
import { ManageAdvancePaymentsComponent } from './components/manage-advance-payments/manage-advance-payments.component';
import { DateQuotesComponent } from './components/date-quotes/date-quotes.component';

export const appRoutes: Routes = [
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Payments] }
  },
  {
    path: 'summary',
    component: SummaryComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_MyAccountBalance] }
  },
  // {
  //   path: 'automatic-debit',
  //   component: AutomaticDebitComponent,
  //   canActivate: [AuthGuard],
  //   data: { requiredPermissions: [EPermission.Access_Automatic_Debt] }
  // },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Contact] }
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Configuration] }
  },
  {
    path: 'pay-configuration',
    component: PaymentConfirmationComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Payments, EPermission.Access_Configuration] }
  },
  {
    path: 'debt-posts',
    component: DebtPostsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Debt_Post] }
  },
  {
    path: 'debin',
    component: DebinComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Inform_Manually] }
  },
  {
    path: 'accounts-state',
    component: ClientsAccountStateComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Accesss_CRM] }
  },
  /*{
    path: 'communications',
    component: CommunicationComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Accesss_CRM] }
  },*/
  {
    path: 'templates',
    component: TemplateIndexComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Templates] }
  },
  {
    path: 'create-template',
    component: TemplateEditorComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Accesss_CRM] }
  },
  {
    path: 'support',
    component: SupportComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Support] }
  },
  {
    path: 'quotations',
    component: QuotationsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Accesss_CRM, EPermission.Access_Quotations] }
  },
  {
    path: 'frequent-questions',
    component: FrequentQuestionsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_FAQ] }
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Payments] }
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Payments] }
  },
  {
    path: 'report-render-account',
    component: ReportRenderAccountComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'report-rejected-santander',
    component: ReportRejectedSantanderComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'report-login',
    component: LastAccessListComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'report-site-repeated',
    component: RepeatedDebtDetailsListComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'report-duplicate-mails',
    component: RepeatedClientEmailsListComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'report-created-user',
    component: CreatedUserComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'report-published-debt-files',
    component: PublishedDebtFilesComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Reports] }
  },
  {
    path: 'advance-payments',
    component: AdvancePaymentsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_AdvancePayments] }
  },
  {
    path: 'lastaccess',
    component: LastAccessListComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Support] }
  },
  {
    path: 'quotations-table',
    component: QuotationsTableComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Payments] }
  },
  {
    path: 'quick-access-quotations',
    component: QuickAccessQuotationsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [] }
  },
  {
    path: 'echeq',
    component: PaymentReportsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Admin_Payments] }
  },
  {
    path: 'manage-advance-payments',
    component: ManageAdvancePaymentsComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Admin_AdvancePayments]}
  },
  {
    path: 'publish-date-quotes',
    component: DateQuotesComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Quotations] }
  },
  {
    path: 'debt-free',
    component: DebtFreeComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [EPermission.Access_Debt_Free] }
  },
  { path: '', canActivate:[UserDefaultGuard], pathMatch: 'full',
  children: [] },
  { path: '**', component: PageNotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(
    appRoutes,
    { enableTracing: !environment.production, useHash: true, relativeLinkResolution: 'legacy' } // <-- debugging purposes only
 // <-- debugging purposes only
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
