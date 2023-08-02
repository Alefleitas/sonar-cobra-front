import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { API, APIDefinition, Columns, Config, STYLE, THEME } from 'ngx-easy-table';
import { finalize } from 'rxjs/operators';
import { toaster } from 'src/app/app.component';
import { PublishedDebtFile } from 'src/app/models/published-debt-file.model';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-published-debt-files',
  templateUrl: './published-debt-files.component.html',
  styleUrls: ['./published-debt-files.component.scss']
})
export class PublishedDebtFilesComponent implements OnInit {


  @ViewChild('tableOk', { static: true }) tableOk: APIDefinition;
  @ViewChild('tableError', { static: true }) tableError: APIDefinition;
  @ViewChild('createdOn', { static: true }) createdOn: TemplateRef<any>;

  

  columnsOk: Columns[] = [
    { key: 'id', title: 'Id', width: '100px' },
    { key: 'debtFileName', title: 'Nombre archivo', width: '100px' },
    { key: 'createdOn', title: 'Fecha de creación', width: '100px' },
  ];

  columnsError: Columns[] = [
    { key: 'id', title: 'Id', width: '100px' },
    { key: 'debtFileName', title: 'Nombre archivo', width: '100px' },
    { key: 'createdOn', title: 'Fecha de creación', width: '100px' },
    { key: 'errorDescription', title: 'Descripción', width: '100px' },
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

  publishedDebtFiles: PublishedDebtFile[] = [];
  publishedDebtFilesOk: PublishedDebtFile[] = [];
  publishedDebtFilesError: PublishedDebtFile[] = [];

  isLoading: boolean = false;
  selectedTab: number;

  constructor(private paymentsService: PaymentService) { }

  ngOnInit(): void {
    _.forEach(this.columnsOk, col => {
      if (col.key === 'createdOn')
        col['cellTemplate'] = this.createdOn;
    });
    _.forEach(this.columnsError, col => {
      if (col.key === 'createdOn')
        col['cellTemplate'] = this.createdOn;
    });
    this.getAllPublishedDebtFiles();
  }


  getAllPublishedDebtFiles(){
    this.isLoading = true;

    this.paymentsService.getGetAllPublishedDebtFiles()
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe(
      (res: PublishedDebtFile[]) => {

        res.forEach(publishedDebtFile => {

          if (publishedDebtFile.error != undefined) {
            console.log(publishedDebtFile);
            try {
              let errorJson = JSON.parse(publishedDebtFile.error);
              publishedDebtFile.errorDescription = errorJson[0].Description;
            } catch (e) {
              publishedDebtFile.errorDescription = publishedDebtFile.error;
            }
            
          }
    
        });

        this.publishedDebtFiles = res;
        this.publishedDebtFilesOk = this.publishedDebtFiles.filter(u => u.success);
        this.publishedDebtFilesError = this.publishedDebtFiles.filter(u => !u.success);

      },
      error => {
        console.log(error);
        toaster.error(
          `Ha ocurrido un error al obtener las publicaciones de deuda.`,
          'Error '
        );
      }
    );
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

  _onTabChanged(e) {
    this.selectedTab = e.index;
  }

}
