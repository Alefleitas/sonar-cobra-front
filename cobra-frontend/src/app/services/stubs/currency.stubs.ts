import { Currency } from 'src/app/models/currency';

export class CurrencyStubs {
data : any[] =[{
    id: 1,
    code: 'ARS'
  },
  {
    id: 2,
    code: 'USD'
  },
  {
    id: 3,
    code: 'UVA'
  },
  {
    id: 4,
    code: 'EUR'
  }];

  getCurrencys() {
    return new Promise((resolve, reject) => {
      resolve({
        data: this.data
      });
    });
  }

postCurrency(currency: Currency)  {
  
  this.data.push(currency);

  return new Promise((resolve, reject) => {
    resolve({
      data: {
        id: 200,
        code: 'Ok'
      }});
  });
}

}
