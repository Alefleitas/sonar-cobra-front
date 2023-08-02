import { Injectable } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }
   init() {
    this.matIconRegistry.addSvgIcon(
      "consultatio",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/consultatio-logo-azul.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "consultatioBlanco",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/consultatio-logo-blanco.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "custom-cog",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/custom-cog.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "nordelta",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/nordelta.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "nordeltaBlanco",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/nordelta-blanco.svg")
    );

    this.matIconRegistry.addSvgIcon(
      "legales",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/Consultatio-legales-01.svg")
    )

    this.matIconRegistry.addSvgIcon(
      "chat",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/chat.svg")
    )

    this.matIconRegistry.addSvgIcon(
      "paper",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/paper.svg")
    )

    this.matIconRegistry.addSvgIcon(
      "edit",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/editar.svg")
    )

    this.matIconRegistry.addSvgIcon(
      "payment-edit",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/payment_edit.svg")
    )
  }
}
