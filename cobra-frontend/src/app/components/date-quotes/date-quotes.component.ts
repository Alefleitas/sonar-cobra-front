import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toaster } from "src/app/app.component";
import { DateQuotesService } from 'src/app/services/date-quotes.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { QuotationExternal, QuotationsInput } from './date-quotes.interface';

@Component({
  selector: 'app-date-quotes',
  templateUrl: './date-quotes.component.html',
  styleUrls: ['./date-quotes.component.scss']
})
export class DateQuotesComponent implements OnInit {
  isLoading: boolean = false;
  sourceTypesList: string[] = [];
  showCheckboxes = false;
  sgfChecked = false;
  sgcChecked = false;
  showButton = false;
  totalItems: number;
  filteredDate: Date;
  itemsPerPage: number = 10;
  currentPage: number = 0;
  selectedSystems: string[] = [];
  quotationsExternal: QuotationExternal[] = [];
  quotationsToSend: QuotationsInput = {
    generatedQuotations: [],
    quotationsOrigen: []
  };
  quotationsOrigen: QuotationExternal[] = [];
  dataSource = new MatTableDataSource<QuotationExternal>(this.quotationsExternal);
  selection = new SelectionModel<QuotationExternal>(true, []);
  selectedRows: QuotationExternal[] = [];
  selectedMap = new Map<number, boolean>();
  isFormValid: boolean = false;

  noDataTemplate: any = 'No hay registros para mostrar';
  displayedColumns: string[] = ['select', 'description', 'valor', 'fromCurrency', 'toCurrency', 'effectiveDateFrom', 'effectiveDateTo', 'storedInDb'];
  myForm: FormGroup;
  defaultValues = {
    sourceTypesList: [],
    fecha: null,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _dateQuoteService: DateQuotesService, private fb: FormBuilder) {

    this.myForm = this.fb.group({
      fecha: [null, [Validators.required]],
      sourceTypesList: [null, Validators.required]
    });


    this.myForm.valueChanges.subscribe(() => {
      this.isFormValid = this.myForm.get('fecha').value && this.myForm.get('sourceTypesList').value;
    });

  }

  ngOnInit(): void {

    this.isLoading = true;
    this._dateQuoteService.getSourceTypes()
      .subscribe({
        next: sourceTypes => {
          this.sourceTypesList = sourceTypes
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
        }
      });

    this.paginator?.page.subscribe(() => {
      this.updateTableData();
    });
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedMap.clear();
      this.selectedRows = [];
    } else {
      this.quotationsExternal.forEach(row => {
        this.selection.select(row);
        this.selectedMap.set(row.id, true);
        if (!this.selectedRows.includes(row)) {
          this.selectedRows.push(row);
        }
      });
    }
  }
  
  isAllSelected() {
    const numRows = this.quotationsExternal.length;
    this.quotationsExternal.forEach(row => {
      if (!this.selectedMap.has(row.id)) {
        this.selectedMap.set(row.id, false);
      }
    });
  
    const numSelectedInMap = Array.from(this.selectedMap.values()).filter(value => value).length;
    return numSelectedInMap === numRows;
  }
  

  
  updateTableData() {
    this.selectedMap.clear();
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageItems = this.quotationsExternal.slice(startIndex, endIndex);
    this.dataSource.data = pageItems;
    this.dataSource.data.forEach((row, index) => {
      row.id = startIndex + index + 1;
    });
  }
  
  onSelectionChange(row: QuotationExternal): void {
    if (this.selection.isSelected(row)) {
      this.selectedRows.push(row);
      this.selectedMap.set(row.id, true);
    } else {
      const index = this.selectedRows.findIndex((r) => r.id === row.id);
      this.selectedRows.splice(index, 1);
      this.selectedMap.set(row.id, false);
    }
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updateTableData();
  }



  onSearch(): void {
    this.isLoading = true;
    this.filteredDate = this.myForm.value.fecha.toISOString().substring(0, 10);
    const sourceTypes = this.myForm.value.sourceTypesList;
    this._dateQuoteService.getSourceQuoteByDate(this.filteredDate, sourceTypes)
      .subscribe({
        next: (quotations: QuotationsInput) => {
          this.isLoading = false;
          this.quotationsOrigen = quotations.quotationsOrigen;
          this.quotationsExternal = quotations.generatedQuotations;
          this.totalItems = this.quotationsExternal.length;
          this.dataSource.data = this.quotationsExternal.slice(0, this.itemsPerPage); // actualizar la lista de elementos
          this.updateTableData();
          
        },
        error: err => {
          this.isLoading = false;
        }
      });
  }


  onDeleteSelected(): void {
    const selectedIds = this.selectedRows.map((row) => row.id);
    this.quotationsExternal = this.quotationsExternal.filter(
      (row) => !selectedIds.includes(row.id)
    );
    this.selectedRows = this.selectedRows.filter(
      (row) => !selectedIds.includes(row.id)
    );
    this.dataSource.data = this.quotationsExternal;
    this.selection.clear();
  }


  onCheckBoxChange(event: any, row: QuotationExternal): void {

    if (event.checked) {
      this.selectedRows.push(row);
    } else {
      const index = this.selectedRows.findIndex((r) => r.id === row.id);
      this.selectedRows.splice(index, 1);
    }
  }


  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getSelectedSystems(): string {
    let selectedSystems = '';
    if (this.sgfChecked) {
      selectedSystems += 'ORACLE ';
    }
    if (this.sgcChecked) {
      selectedSystems += 'SGC';
    }
    return selectedSystems.trim();
  }



  onInformToSystems(): void {
    this.isLoading = true;
    if (this.sgcChecked) {
      this.selectedSystems.push('SGC')
    }
    if (this.sgfChecked) {
      this.selectedSystems.push('SGF')
    }

    this.selectedRows.forEach(element => {
      element.id = 0;
    });

    this.quotationsToSend.generatedQuotations = this.quotationsExternal;
    this.quotationsToSend.quotationsOrigen = this.quotationsOrigen;

    this._dateQuoteService.informToSystems(this.quotationsToSend, this.selectedSystems, this.filteredDate)
      .subscribe({
        next: resp => {
          this.isLoading = false;
          this.selectedRows = [];
          this.dataSource.data = [];
          this.selectedSystems = [];
          this.sgcChecked = false;
          this.sgfChecked = false;
          this.selection.clear();
          toaster.success(
            `Se ha informado las cotizaciones a los sistemas correctamente`,
            'Éxito ')
        },
        error: err => {
          this.isLoading = false;
          this.selectedRows = [];
          this.selectedSystems = [];
          this.dataSource.data = [];
          this.sgcChecked = false;
          this.sgfChecked = false;
          toaster.error(
            `No se pudo informar las cotizaciones a los sistemas correctamente.`,
            ' Error ')
        }
      });


  }

}
