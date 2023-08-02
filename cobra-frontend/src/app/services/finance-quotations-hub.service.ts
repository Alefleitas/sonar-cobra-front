import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FinanceQuotationsHubService {

  connection: HubConnection;
  websocketEndpoint: string = "/quotation"
  package: any = null;
  establishingConnection: boolean = false;
  disconnected: boolean = false;
  failedConnection: boolean = false;
  highlightUpdateTime: boolean = false;

  websocketCommands = {
    SendQuotations: "SendQuotations",
    UpdateQuotations: "UpdateQuotations"
  }

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.baseWebSocket + this.websocketEndpoint, { withCredentials: false })
      .build();

    this.connectToWebSocket();
  }

  public connectToWebSocket() {

      this.loadListeners();
  
      this.connection.start()
        .then(_ => {
          this.establishingConnection = true;
          this.failedConnection = false;
          this.disconnected = false;
        })
        .catch(error => {
          this.failedConnection = true;
          return
        })
  
      this.connection.onclose(_ => {
        this.establishingConnection = false;
        this.disconnected = true;
        window.location.reload();
      })
  
      this.connection.onreconnecting(_ => {
        this.establishingConnection = true;
        this.disconnected = false;
      })
  }

  // Para traer data del servidor
  // this.connection.invoke('methodName');

  private loadListeners() {
    this.connection.on(this.websocketCommands.SendQuotations, data => {
      this.package = data;
      this.highlight()
    })

    this.connection.on(this.websocketCommands.UpdateQuotations, data => {
      this.package = data;
      this.highlight()
    })
  }

  public highlight() {
    this.highlightUpdateTime = true;

    setTimeout(() => {
      this.highlightUpdateTime = false;
    }, 2000)
  }


}

