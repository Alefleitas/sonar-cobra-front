export class Communication {
    id: number;
    date: Date;
    nextCommunicationDate: Date;
    incoming: boolean;
    communicationChannel: EComChannelType;
    communicationResult: ECommunicationResult;
    description: string;
    contactDetail: ContactDetail;
    contactDetailId: number;
    
    ssoUser?: any;
}

export enum EComChannelType {
    Reunion,
    Mediacion,
    Whatsapp,
    Telefono,
    CorreoElectronico,
    Videoconferencia,
    CartaDocumento,
    Otro
}

export enum ECommunicationResult {
    SinRespuesta = 0,
    DatosErroneosDeContacto = 1,
    BuzonDeVoz = 2,
    DerivadoAResponsable = 3,
    ContactoSinCompromiso = 4,
    CompromisoDePagoParcial = 5,
    CompromisoDePago = 6,
    PagoParcialRealizado = 7,
    PagoRealizado = 8,
    SinIntencionDePago = 9,
    Revisar = 10
}

export class ContactDetail{
    id: number;
    userId: string;
    comChannel: EComChannelType;
    value: string;
    description: string;
}

export class ClientContactDetail{
    emailAddress: string
    documentNumber: string
    partyName: string
    addressLine1: string
    addressLine2: string
    addressLine3: string
    cp: string
    city: string
    state: string
    producto: string
}