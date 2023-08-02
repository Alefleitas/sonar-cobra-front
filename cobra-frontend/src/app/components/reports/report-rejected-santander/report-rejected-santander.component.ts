import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { API, APIDefinition, Columns, Config } from 'ngx-easy-table';
import { toaster } from 'src/app/app.component';
import { DebtRejection } from 'src/app/models/debt-rejection.model';
import { PublishDebtRejection } from 'src/app/models/publish-debt-rejection.model';
import { ReportsService } from 'src/app/services/reports.service';
import { ConfigEasyTableService } from '../reports.configuration-easy-table.service';

@Component({
  selector: 'app-report-rejected-santander',
  templateUrl: './report-rejected-santander.component.html',
  styleUrls: ['./report-rejected-santander.component.scss']
})
export class ReportRejectedSantanderComponent implements OnInit {

  @ViewChild('table') table: APIDefinition;
  @ViewChild('action') actionTemplate: TemplateRef<any>;
  @ViewChild('moneda') monedaTemplate: TemplateRef<any>;
  public toggledRows = new Set<number>();

  selectedTab: number;

  debtRejections: DebtRejection[] = [];
  publishDebtRejections: PublishDebtRejection[] = [];
  filteredPublishDebtRejection: PublishDebtRejection[] = [];
  maxDate : Date = new Date();
  dateDesde : Date;
  dateHasta : Date;

  debtRejectionConfiguration: Config;
  debtRejectionErrorsConfiguration: Config;

  columnsDebtRejection: Columns[];
  columnsDebtRejectionErrors: Columns[];

  isLoading: boolean;
  files: string[];
  constructor(private reportService: ReportsService) { }

  ngOnInit(): void {

    this.debtRejectionConfiguration = ConfigEasyTableService.debtRejection;
    this.debtRejectionErrorsConfiguration = ConfigEasyTableService.debtRejectionErrors;

    this.columnsDebtRejection = ConfigEasyTableService.columnsDebtRejection;
    this.columnsDebtRejectionErrors = ConfigEasyTableService.columnsDebtRejectionErrors;

    this.publishDebtRejections = new Array<PublishDebtRejection>();

    if ((this.dateDesde || this.dateHasta) && this.dateDesde?.getTime() <= this.dateHasta?.getTime()){
      this.isLoading = true;

      this.debtRejections.forEach( d => {
        this.publishDebtRejections.push(...d.publishDebtRejections);
      });

      this.filteredPublishDebtRejection = _.cloneDeep(this.publishDebtRejections);

      this.reportService.GetDebtRejections(this.dateDesde, this.dateHasta).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.debtRejections = res;
  
          this.debtRejections.forEach( d => {
            this.publishDebtRejections.push(...d.publishDebtRejections);
          });
  
          this.filteredPublishDebtRejection = _.cloneDeep(this.publishDebtRejections);
  
  
        }, error => {
            this.isLoading = false;
            toaster.error(
              `Póngase en contacto con su administrador para obtener más información: ${error.message}`,
              'Error '
            );
        });
    } else {
      this.filteredPublishDebtRejection = [];
    }
  }


  ngAfterViewInit() {
    this.columnsDebtRejection[2].cellTemplate = this.monedaTemplate;
    this.columnsDebtRejection[5].cellTemplate = this.actionTemplate;
  }


  filterDebtRejectionsByDate(){
    this.ngOnInit();
  }

  _onTabChanged(e) {
    this.selectedTab = e.index;
  }

  onRowClickEvent($event: MouseEvent, index: number): void {
    $event.preventDefault();
    this.table.apiEvent({
      type: API.toggleRowIndex,
      value: index,
    });
    if (this.toggledRows.has(index)) {
      this.toggledRows.delete(index);
    } else {
      this.toggledRows.add(index);
    }
  }

}
