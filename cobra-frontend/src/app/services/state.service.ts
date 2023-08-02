import { Injectable } from '@angular/core';
import { Communication } from '../models/communication';
import { Template, NotificationType } from '../models/template';
import { AccountBalanceUser } from '../models/account-balance';

@Injectable({
  providedIn: 'root'
})

export class StateService {
    notificationType: NotificationType;
    data: Array<Communication>;
    name: string;
    product: string;
    canEdit: boolean;
    client: AccountBalanceUser;
    id;
}
