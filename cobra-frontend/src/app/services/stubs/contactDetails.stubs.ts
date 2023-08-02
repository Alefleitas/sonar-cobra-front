import { Injectable } from '@angular/core';
import { EComChannelType, ContactDetail } from 'src/app/models/communication';

@Injectable({
    providedIn: 'root'
})
export class ContactDetailsStub {
    contactDetails: Array<ContactDetail> = [{
        userId: "1",
        comChannel: EComChannelType.Telefono,
        value: "44445555",
        description: "Telefono casa"
    },
    {
        userId: "1",
        comChannel: EComChannelType.Telefono,
        value: "47754545",
        description: "Oficina. 9 a 15hs"
    }, {
        userId: "1",
        comChannel: EComChannelType.CorreoElectronico,
        value: "titular@gmail.com",
        description: "Titular"
    }, {
        userId: "2",
        comChannel: EComChannelType.Telefono,
        value: "1545454545",
        description: "Celular"
    }, {
        userId: "2",
        comChannel: EComChannelType.Telefono,
        value: "15777785",
        description: "Hermano"
    }
    ]

    getContactDetails(userId: string): Promise<Array<ContactDetail>> {
        return new Promise((resolve, reject) => {
            resolve(this.contactDetails.filter(contactDetail => contactDetail.userId == userId));
        });
    }
}