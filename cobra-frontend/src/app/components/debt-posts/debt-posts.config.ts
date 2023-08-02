import { Injectable } from '@angular/core';
import { Config, STYLE, THEME, Columns } from 'ngx-easy-table';

@Injectable()
export class ConfigEasyTableService {
  public static columns = [
    { key: 'fechaPrimerVenc', title: 'Fecha Vencimiento', width: 'auto' },
    { key: 'importePrimerVenc', title: 'Importe', width: 'auto' },
    { key: 'archivoDeuda.formatedFileName', title: 'Nombre Archivo', width: 'auto' }
  ];
}
