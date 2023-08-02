import {Component, OnInit, ViewChild} from '@angular/core';
import {API, APIDefinition, Columns, Config} from "ngx-easy-table";
import {SupportService} from "../../../services/support.service";
import {ConfigEasyTableService} from "../reports.configuration-easy-table.service";
import {toaster} from "../../../app.component";
import {RepeatedClientEmail} from "../../../models/repeated-client-email";

@Component({
  selector: 'app-repeated-client-emails-list',
  templateUrl: './repeated-client-emails-list.component.html',
  styleUrls: ['./repeated-client-emails-list.component.scss']
})
export class RepeatedClientEmailsListComponent implements OnInit {
  isLoading: boolean;
  repeatedClientEmails: RepeatedClientEmail[] = [];
  columns: Columns[];

  configurationRepeatedDebsDetails: Config;

  @ViewChild('table', { static: true }) table: APIDefinition;
  constructor(
    private supportService: SupportService
  ) { }

  ngOnInit(): void {
    this.columns = [
      { key: 'cuit', title: 'Cuit', width: '33%' },
      { key: 'email', title: 'Correo electrónico', width: '33%' },
      { key: 'razonSocial', title: 'Razón social', width: '33%' }
    ];

    this.configurationRepeatedDebsDetails = ConfigEasyTableService.repeatedDebtDetailsConfig;
    this.isLoading = true;

    this.supportService.getAllRepeatedClientEmails().subscribe(x => {
      this.isLoading = false;
      this.repeatedClientEmails = x;
    }, error => {
      this.isLoading = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
        'Error '
      );
    });
  }
  onChange(name: string): void {
    this.table.apiEvent({
      type: API.onGlobalSearch, value: name,
    });
  }

}
