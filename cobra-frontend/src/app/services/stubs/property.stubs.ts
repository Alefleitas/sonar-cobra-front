export class PropertyStubs {
  getPropertys() {
    return new Promise((resolve, reject) => setTimeout(() => {
      resolve({
        data: [{
          id: 1,
          name: 'Casa Quinta',
          address: 'Barrio  - Alvear 12',
          lotNumber: 20,
          price: 1500,
          currency: {
            id: 1,
            code: 'ARS'
          }
        },
        {
          id: 2,
          name: 'Casa Campo',
          address: 'Barrio  - San Martin 1212',
          lotNumber: 10,
          price: 2500,
          currency: {
            id: 2,
            code: 'USD'
          }
        },
        {
          id: 3,
          name: 'Casa 3 Plantas',
          address: 'Barrio  - Belgrano 1212',
          lotNumber: 35,
          price: 3500,
          currency: {
            id: 3,
            code: 'UVA'
          }
        },
        {
          id: 4,
          name: 'Dpto en Pozo',
          address: 'Barrio  - Alvear 95',
          lotNumber: 35,
          price: 3500,
          currency: {
            id: 4,
            code: 'EUR'
          }
        }]
      });
    }, 2000));
  }
}
