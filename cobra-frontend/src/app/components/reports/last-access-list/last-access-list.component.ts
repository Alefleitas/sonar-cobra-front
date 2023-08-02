import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {API, APIDefinition, Columns, Config, STYLE, THEME} from "ngx-easy-table";
import {UserLastAccess} from "../../../models/user-last-access";
import {SupportService} from "../../../services/support.service";
import * as moment from 'moment';
import * as _ from "lodash";
import {toaster} from "../../../app.component";
import {ConfigEasyTableService} from "../reports.configuration-easy-table.service";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-last-access-list',
  templateUrl: './last-access-list.component.html',
  styleUrls: ['./last-access-list.component.scss']
})
export class LastAccessListComponent implements OnInit {

  isLoading: boolean;
  accessDS: UserLastAccess[] = [];
  columns: Columns[];

  configurationLastAccess: Config;

  @ViewChild('table', { static: true }) table: APIDefinition;
  @ViewChild('lastLoginColumn', { static: true }) lastLoginColumn: TemplateRef<any>;
  constructor(
    private supportService: SupportService
  ) { }



  ngOnInit(): void {
    this.columns =  [
      { key: 'usuarioNombre', title: 'Razón Social', width: '33%' },
      { key: 'email', title: 'Correo electrónico', width: '33%' },
      { key: 'lastLogin', title: 'Último ingreso', width: '33%', cellTemplate: this.lastLoginColumn}
    ];

    this.configurationLastAccess = ConfigEasyTableService.lastAccessConfig;
    this.isLoading = true;
    this.supportService.getAllLastAccess().subscribe(x => {
      this.isLoading = false;
      this.accessDS = x;
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


  exportToExcel(): void {
    //Here is simple example how to export to excel by https://www.npmjs.com/package/xlsx
    try {
      /* generate worksheet */
      //removes unnecesary fields
      let dataToExport = _.map(this.accessDS, d => {
        const access = _.omit(d, ['userId', 'sistemaId', 'sistemaNombre']);
        access.lastLogin = moment(access.createdOn).format('DD-MM-YYYY HH:mm:ss');
        access.createdOn = moment(access.createdOn).format('DD-MM-YYYY HH:mm:ss');
        access.modifiedOn = moment(access.createdOn).format('DD-MM-YYYY HH:mm:ss');
        return access;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

      //renaming headers
      ws.A1.v = 'Email';
      ws.B1.v = 'Nombre Usuario';
      ws.C1.v = 'Ultimo Login';
      ws.D1.v = 'Fecha Creacion';
      ws.E1.v = 'Fecha Modificacion';

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, `Login de Usuarios al ${moment().format('DD-MM-YYYY HH:mm')}.xlsx`);
    } catch (err) {
      toaster.error(`Ocurrió un error al exportar en Excel: ${err.message}`, 'Error ');
    }
  }
}
