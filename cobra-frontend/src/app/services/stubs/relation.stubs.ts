import { Injectable } from "@angular/core";
@Injectable()
export class RelationtStubs {
    getRelations() {
      return new Promise((resolve, reject) => {
        resolve({
          data: [{
            id: 1,
            relat: 'Esposo/a'
          },
          {
            id: 2,
            relat: 'Hijo/a'
          },
          {
            id: 3,
            relat: 'Socio/a'
          },
          {
            id: 4,
            relat: 'Otro'
          }]
        });
      });
    }
  }