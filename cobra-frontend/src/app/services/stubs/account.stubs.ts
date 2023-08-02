
import { AccountBank } from 'src/app/models/account-bank';

export class AccountStubs {
          data: any [] = [{
            id: 1,
            cbu: '1234567891234567891234'
          },
          {
            id: 2,
            cbu: '9876543216549876543216'
          },
          {
            id: 3,
            cbu: '7418529637418529637418'
          }]
        
      
    getAccounts() {
      return new Promise((resolve, reject) => {
        resolve({
          data:this.data});
        });
      }

      postAccountBank(accountBank :AccountBank): any{
      this.data.push(accountBank);
      return new Promise((resolve, reject)=>{
        resolve({
          data:{
            id:200,
            code:'ok'
          }
        });
      });
    }
  }