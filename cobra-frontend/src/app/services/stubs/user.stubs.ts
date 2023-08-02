export class UserStubs {
  data = [{
    id: 1,
    firstName: 'Belen',
    lastName: 'Chiaradia',
    password: 'Password123!',
    email: 'bchiaradia@nordelta.com',
    birthDate: '05/05/1987'
  }, {
    id: 2,
    firstName: 'Josefina',
    lastName: 'Otaola',
    password: 'Password123!',
    email: 'jotaola@nordelta.com',
    birthDate: '05/05/1987'
  }];

  getUsers() {
    return new Promise((resolve, reject) => {
      resolve({
        data: this.data
      });
    });
  }

  public editPasswordUsers(email: string, currentPassword: string, nowPassword: string) {
    let code = 400;
    this.data.forEach(element => {
      if (element.email === email) {
        if (element.password === currentPassword) {
          element.password = nowPassword;
          code = 200;
        }
      }
    });

    if (code===200) {
      return new Promise((resolve, reject) => {
        resolve({
          data: {
            id:'Ok',
            code: '200'
          }});
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve({
          data: {
            id:'Error No Conciden Datos',
            code: '400'
          }});
      });
    }
  }
}

