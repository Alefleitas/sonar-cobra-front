import { Injectable } from '@angular/core';
import { TemplateTokenReference } from 'src/app/models/template-token-reference';

@Injectable({
    providedIn: 'root'
})
export class TemplateTokenReferenceStub {
    templateTokenReferences: Array<TemplateTokenReference> = [{
        id: 0,
        token: "{{NOMBRE_PROPIEDAD}}",
        objectProperty: "NroComprobante",
        description: "Nombre de la propiedad"
    }, {
        id: 1,
        token: "{{CLIENTE_NOMRE}}",
        objectProperty: "RazonSocial",
        description: "Nombre y apellido del cliente"
    }, {
        id: 2,
        token: "{{CLIENTE_CUIT}}",
        objectProperty: "Cuit",
        description: "Cuit del cliente"
    }, {
        id: 3,
        token: "{{DEBIN_CODIGO}}",
        objectProperty: "DebinCode",
        description: "Código del Debin"
    }]

    getTemplateTokenReferences(): Promise<Array<TemplateTokenReference>> {
        return new Promise((resolve, reject) => {
            resolve(this.templateTokenReferences);
        });
    }
}