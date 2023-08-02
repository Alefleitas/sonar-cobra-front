import {Component, OnInit, ViewChild} from '@angular/core';
import {API, APIDefinition, Columns, Config} from "ngx-easy-table";
import {SupportService} from "../../services/support.service";
import {ConfigEasyTableService} from "../reports/reports.configuration-easy-table.service";
import {toaster} from "../../app.component";
import { AuditoryCurrencyProfile } from 'src/app/services/auditory-profile-currency';

@Component({
  selector: 'app-auditory-profile-currency-list',
  templateUrl: './auditory-profile-currency-list.component.html',
  styleUrls: ['./auditory-profile-currency-list.component.scss']
})
export class AuditoryProfileCurrency implements OnInit {
  isLoading: boolean;
  auditoryCurrencyProfile: AuditoryCurrencyProfile[] = [];
  columns: Columns[];

  configurationAuditoryProfileCurrency: Config;

  @ViewChild('table', { static: true }) table: APIDefinition;
  constructor(
    private supportService: SupportService
  ) { }

  ngOnInit(): void {
    this.columns = [
      { key: 'idRegistro', title: 'Id Registro'},
      { key: 'nombreCliente', title: 'Nombre Cliente'},
      { key: 'numeroCuenta', title: 'Número Cuenta'},
      { key: 'numeroSitio', title: 'Número Sitio'},
      { key: 'nombreSitio', title: 'Site'},
      { key: 'descripcionSitio', title: 'Línea Domicilio'},
      { key: 'observacion', title: 'Observación'}
    ];

    this.configurationAuditoryProfileCurrency = ConfigEasyTableService.configurationAuditoryProfileCurrency;
    this.isLoading = true;
    this.supportService.getAuditoryProfileCurrency().subscribe(x => {
      this.isLoading = false;
      this.auditoryCurrencyProfile = x;
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
