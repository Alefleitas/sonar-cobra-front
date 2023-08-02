import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { FinanceQuotationsHubService } from 'src/app/services/finance-quotations-hub.service';
import { amountConvertTool } from 'src/app/util/amountConvert.pipe';

@Component({
  selector: 'app-quick-access-quotations',
  templateUrl: './quick-access-quotations.component.html',
  styleUrls: ['./quick-access-quotations.component.scss']
})
export class QuickAccessQuotationsComponent implements OnInit, OnDestroy {

  dataSource;
  displayedColumns: string[] = ['titulo', 'valor', 'variacionDiaria', 'variacionMensual', 'variacionAnual'];
  interval: any;
  intervalTime: any;
  eTipoQuote = ETipoQuote;
  eSubtipoQuote = ESubtipoQuote;
  eTipoVariacion = ETipoVariacion;
  displayOutdatedTime: any;

  verAlertaDesactualizacion: boolean = true;
  verAlertaDesconexion: boolean = true;

  constructor(private financeService: FinanceQuotationsHubService) {
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.checkFailedConnection();
    }, 5000);

    this.intervalTime = setInterval(() => {
      this.displayOutdatedTime = null;
      if (this.financeService.package?.date) {
        let date = moment(this.financeService.package?.date).fromNow();
        if (!date.includes("segundo") && !date.includes("un minuto")) this.displayOutdatedTime = date;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    clearInterval(this.intervalTime);
  }
  public displayQuotations() {
    return this.financeService.package?.quotations;
  }
  
  public displayDate() {
    return this.financeService.package?.date;
  }

  public highlight() {
    return this.financeService.highlightUpdateTime;
  }

  public connectionOK() {
    return this.financeService.establishingConnection;
  }

  public disconnection() {
    return this.financeService.disconnected;
  }

  public checkFailedConnection() {
    if (this.financeService.failedConnection) {
      this.financeService.connectToWebSocket();
    }
  }

  public isConnectionFailed(){
    return this.financeService.failedConnection;
  }

  ngOnChange() {
    this.dataSource.data = this.displayQuotations();
  }

  public showValue(element): number {
    if (!!element.valor) return element.valor;
  }

  public showVariation(element, tipo) {

    if (!!element.variacion && element.variacion.length > 0) {

      let data = element.variacion.find(x => x.tipo === tipo);

      if (!data.historicAvailable) return ""

      let num = data.valor.toFixed(2)

      if (element.tipo === this.eTipoQuote.CANJE || element.tipo === this.eTipoQuote.CAUCION) {
        return amountConvertTool(num, null, true) + " b.p.";
      }

      return amountConvertTool(num, null, true) + "%";
    }
  }

  public determineColor(element, tipo) {
    if (!!element.variacion && element.variacion.length > 0) {

      let data = element.variacion.find(x => x.tipo === tipo);

      if (!data.historicAvailable) return ""

      let num = data.valor.toFixed(2)

      if (num > 0) return "greenText";
      if (num < 0) return "redText";
    }
    return ""
  }

  public checkTipoTooltip(tooltip, destino){
    if (destino === "style"){
      switch(tooltip){
        case "outdated":
          return "color: orange;"
        case "error":
          return "color: red;"
        case "alert":
          return "color: #3080e3;"
      }
    }
    if (destino === "icon"){
      switch(tooltip){
        case "outdated":
          return "schedule"
        case "error":
          return "error"
        case "alert":
          return "priority_high"
      }
    }
  }

  closeAlert(tipo){
    if (tipo === "desactualizacion") this.verAlertaDesactualizacion = false;
    if (tipo === "desconexion") this.verAlertaDesconexion = false;
  }

  getTooltipClase(tipo){
    return "adjustText " + tipo;
  }

  getTooltipClaseMobile(tipo){
    return "adjustTextBelow " + tipo;
  }

}


enum ETipoQuote {
  DOLAR,
  ACCION,
  CAUCION,
  CANJE,
  INDICE,
}
enum ESubtipoQuote {
  NINGUNO,
  PLAZO_CERCANO,
  PLAZO_LEJANO,
}
enum ETipoVariacion {
  DIARIA,
  MENSUAL,
  ANUAL
}