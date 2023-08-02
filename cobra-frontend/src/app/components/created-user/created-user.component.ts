import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { API, APIDefinition, Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { finalize } from 'rxjs/operators';
import { toaster } from 'src/app/app.component';
import { CreatedUser } from 'src/app/models/created-user.model';
import { SupportService } from 'src/app/services/support.service';

@Component({
  selector: 'app-created-user',
  templateUrl: './created-user.component.html',
  styleUrls: ['./created-user.component.scss']
})
export class CreatedUserComponent implements OnInit {

  @ViewChild('tableOk', { static: true }) tableOk: APIDefinition;
  @ViewChild('tableError', { static: true }) tableError: APIDefinition;



  columnsCreatedError: Columns[] = [
    { key: 'cuit', title: 'Cuit', width: '100px' },
    { key: 'email', title: 'Email', width: '100px' },
    { key: 'razonSocial', title: 'Razón social', width: '100px' },
    { key: 'errorDescription', title: 'Descripción', width: '300px' }
  ];

  columnsCreatedOk: Columns[] = [
    { key: 'cuit', title: 'Cuit', width: '100px' },
    { key: 'email', title: 'Email', width: '100px' },
    { key: 'razonSocial', title: 'Razón social', width: '100px' }
  ];


  configuration: Config = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: true,
    paginationEnabled: true,
    exportEnabled: false,
    clickEvent: false,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 10,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: true,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: false,
    fixedColumnWidth: true,
    horizontalScroll: false,
    draggable: false,
    logger: false,
    showDetailsArrow: false,
    showContextMenu: false,
    persistState: false,
    tableLayout: {
      style: STYLE.NORMAL,
      theme: THEME.LIGHT,
      borderless: false,
      hover: true,
      striped: false,
    },
  };

  createdUsers: CreatedUser[] = [];
  createdUserOk: CreatedUser[] = [];
  createdUserError: CreatedUser[] = [];
  isLoading: boolean = false;

  selectedTab: number;

  constructor(private supportService: SupportService) {

  }

  ngOnInit(): void {
    this.getCreatedUsers();
  }

  filterOk(value: string) {
    this.tableOk.apiEvent({
      type: API.onGlobalSearch, value: value,
    });
  }


  filterError(value: string) {
    this.tableError.apiEvent({
      type: API.onGlobalSearch, value: value,
    });
  }

  getCreatedUsers() {

    this.isLoading = true;

    this.supportService.getGetAllCreatedUsers()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        (res: CreatedUser[]) => {

    res.forEach(user => {

      if (user.error != undefined) {
        console.log(user);
        try {
          let errorJson = JSON.parse(user.error);
          user.errorDescription = errorJson[0].Description;
        } catch (e) {
          user.errorDescription = user.error;
        }
        
      }

    });

    this.createdUsers = res;
    this.createdUserOk = this.createdUsers.filter(u => u.success);
    this.createdUserError = this.createdUsers.filter(u => !u.success);
        },
        error => {
          console.log(error);
          toaster.error(
            `Ha ocurrido un error al obtener los usuarios creados.`,
            'Error '
          );
        }
      );

  }

  _onTabChanged(e) {
    this.selectedTab = e.index;
  }

}
