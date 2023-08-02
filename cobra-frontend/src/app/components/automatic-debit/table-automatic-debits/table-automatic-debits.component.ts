import { Component, OnInit,ViewChild, TemplateRef, Input, EventEmitter, Output} from '@angular/core';
import { Columns} from 'ngx-easy-table';
import { ConfigEasyTableService } from './configuration-automatic-debit-table.service';
import { AutomaticPayment } from 'src/app/models/automatic-payment';
import * as _ from 'lodash';
import { AuthGuard } from 'src/app/core/guards';

export interface Options {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-table-automatic-debits',
  templateUrl: './table-automatic-debits.component.html',
  styleUrls: ['./table-automatic-debits.component.scss']
})
export class TableAutomaticDebitsComponent implements OnInit {
  @ViewChild('adhereDebit', {static: true}) adhereDebit: TemplateRef<any>;
  @Input() data: any;
  @Output() eventDataHigh:EventEmitter<any>;
  @Output() eventDataLow:EventEmitter<any>;
  @Output() eventData:EventEmitter<any>;
  public columns: Columns[];
  public configuration: any;
  public automaticDebits: any;
  public editRow: number;

  constructor(private authGuard: AuthGuard,) {
    this.eventDataHigh = new EventEmitter<any>();
    this.eventDataLow = new EventEmitter<any>();
  }

  ngOnInit() {
    this.configuration = ConfigEasyTableService.configuration;
    this.columns = this.authGuard.hasRoleWithName('admin') ? ConfigEasyTableService.columnsForAdmin : ConfigEasyTableService.columnsForUser;
    _.forEach(this.columns, col => {
      if (col.key === 'adhereDebit')
        col['cellTemplate'] = this.adhereDebit;
    });
  }

  sendRequest(checked, row: AutomaticPayment) {
    if(checked)
      this.eventDataHigh.emit(row);
    else
      this.eventDataLow.emit(row);
  }
}
