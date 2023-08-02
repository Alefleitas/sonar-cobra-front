import { Role } from './role';
import { BusinessUnits } from './business-units';

export class User {
  userId: string;
  firstName:string;
  lastName: string;
  password?: string;
  userEmail: string;
  userBirthDate:string;
  aditionalCuits: Array<string>;
  businessUnits?: Array<BusinessUnits>;
  userRoles: Array<Role>;
  token?: string;
  popUp?: boolean;
  tcUsd?: string;
  tcUva?: string;
  cuit: string;
  supportUserName?: string;
  supportUserId?: string;
}
