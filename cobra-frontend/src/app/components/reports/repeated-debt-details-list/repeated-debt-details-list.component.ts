import {AfterContentInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ConfigEasyTableService} from "../reports.configuration-easy-table.service";
import {toaster} from "../../../app.component";
import {API, APIDefinition, Columns, Config} from "ngx-easy-table";
import {RepeatedDebtDetails} from "../../../models/repeated-debt-details";
import {SupportService} from "../../../services/support.service";

@Component({
  selector: 'app-repeated-debt-details-list',
  templateUrl: './repeated-debt-details-list.component.html',
  styleUrls: ['./repeated-debt-details-list.component.scss']
})
export class RepeatedDebtDetailsListComponent implements OnInit {
  isLoading: boolean;
  repeatedDebtDetails: RepeatedDebtDetails[] = [];
  columns: Columns[];

  configurationRepeatedDebsDetails: Config;

  @ViewChild('table', { static: true }) table: APIDefinition;
  constructor(
    private supportService: SupportService
  ) { }

  ngOnInit(): void {
    this.columns = [
      { key: 'idSiteOracle', title: 'Site ID Oracle', width: '11%' },
      { key: 'razonSocialCliente', title: 'Razon Social', width: '10%' },
      { key: 'codigoProducto', title: 'Cod. Producto', width: '11%' },
      { key: 'nroCuitCliente', title: 'Cuit', width: '11%' },
    ];

    this.configurationRepeatedDebsDetails = ConfigEasyTableService.repeatedDebtDetailsConfig;
    this.isLoading = true;
    this.supportService.getAllRepeatedDebtDetails().subscribe(x => {
      this.isLoading = false;
      this.repeatedDebtDetails = x;
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
