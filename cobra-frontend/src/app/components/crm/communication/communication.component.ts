import { Component, OnInit, Inject } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { Communication, EComChannelType, ECommunicationResult, ContactDetail, ClientContactDetail } from 'src/app/models/communication';
import { EContactStatus, EDepartment, EBalance, AccountBalanceUser } from 'src/app/models/account-balance';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewCommunicationDialogComponent } from '../new-communication-dialog/new-communication-dialog.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactDetailService } from 'src/app/services/contact-detail.service';
import * as _ from 'lodash';
import { Contact } from 'src/app/models';
import { toaster } from 'src/app/app.component';
import { DialogConfirmDeleteContactDetailComponent } from './dialog-confirm-delete-contact-detail/dialog-confirm-delete-contact-detail.component';
import { ThisReceiver } from '@angular/compiler';
import { CountryISO } from 'ngx-intl-tel-input';
import libphonenumber from 'google-libphonenumber';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {

  communications: Array<Communication> = [];
  client: AccountBalanceUser;
  accountBalanceId;
  name: string;
  product: string;
  eComChannelType = EComChannelType;
  eCommunicationResult = ECommunicationResult;
  clientContactDetails: Array<ClientContactDetail> = [];
  contactDetails: Array<ContactDetail> = [];
  isLoading = false;
  canEdit: boolean;
  cuit: string;
  correoElectronico: string;

  constructor(
    private stateService: StateService,
    public dialog: MatDialog,
    public router: Router,
    private contactDetailsService: ContactDetailService,
    private communicationService: CommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    if (this.data == null) {
      this.router.navigateByUrl("accounts-state")
    }
    // this.communications = this.data.comms.map(comm => {
    //   if(comm.ssoUser)
    //     comm.ssoUser.roles = Array.from(new Set(_.map(comm.ssoUser.roles, a => a.role))).join(', ');
    //   else {
    //     comm['ssoUser'] = {};
    //     comm.ssoUser.razonSocial = 'Sistema';
    //     comm.ssoUser.roles = '';
    //   }
    //   return comm;
    // });
    this.accountBalanceId = this.data.id;
    this.name = this.data.name;
    this.product = this.data.product;
    this.cuit = this.data.cuit;
    this.client = this.data.client;
    this.canEdit = this.data.canEdit;
    this.isLoading = true;

    this.updateCommunications();

    // Oracle
    this.contactDetailsService.getClientcontactDetails({
      cuits: [this.cuit],
      codigoProducto: this.product
    }).subscribe(x => {
      this.clientContactDetails = x;
      this.isLoading = false;
    }, error => {
      //log(error)
      this.isLoading = false;
    });

    // DB
    this.contactDetailsService.getContactDetails({
      userId: this.client.id,
      cuits: [this.cuit],
      codigoProducto: this.product

    }).subscribe(result => {
        this.contactDetails = result;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }

  updateCorreoElectronico(correo: string){
    // Si se cumple indica que se seleccionó un cotacto de oracle
    if (correo != '' && correo != null)
      this.correoElectronico = correo;
    else
      this.correoElectronico = null;
  }

  updateCommunications() {
    this.communicationService.getCommunications(this.accountBalanceId).subscribe( res => {
      if (res) {
        this.communications = res.map(comm => {
          if (comm.ssoUser && comm.ssoUser.roles && comm.ssoUser.roles.length > 0) {
            comm.ssoUser.roles = _.map(comm.ssoUser.roles, a => a.role).join(', ');
          }
          else {
            comm['ssoUser'] = {};
            comm.ssoUser.razonSocial = 'Sistema';
            comm.ssoUser.roles = '';
          }
          return comm;
        });
      }
    }, error => {
    });
  }

  createNewCommunication() {
    const dialogRef = this.dialog.open(NewCommunicationDialogComponent, {
      data: {
        contactDetails: this.contactDetails,
        isEditing: false,
        clientContactDetails: this.clientContactDetails,
        parent: this
      },
      autoFocus: false
    });

    //Después de crear una comunicación satisfactoriamente lo agrega al accordion
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result != "") {
        //Agregamos accountbalanceId y user
        result.AccountBalanceId = this.accountBalanceId;
        result.Client = this.client;
        result.ClientId = this.client.id;
        this.isLoading = true;

        this.communicationService.saveCommunication({
          communication: result,
          correoElectronico: this.correoElectronico
        }).subscribe(response => {
          this.isLoading = false;
          if (response)//response es el nuevo communication con id correcto
          {
            response.ssoUser.roles = Array.from(new Set(_.map(response.ssoUser.roles, a => a.role))).join(', ');
            this.communications.unshift(response);
          }
        })

      }
    });
  }

  editContact(contactDetail: Contact) {
    const dialogRef = this.dialog.open(NewContactDetailDialogComponent, {
      autoFocus: false,
      data: { isEditing: true, contactDetail }
    });

    //Después de crear o actualizar un contacto satisfactoriamente lo agrega al accordion
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result != "") {
        //Agregamos el userId
        result.userId = this.client.id;
        this.isLoading = true;
        this.contactDetailsService.createOrUpdateContactDetail(result).subscribe(response => {
          this.isLoading = false;
          if(response) {
            let index = _.findIndex(this.contactDetails, cd => cd.id == result.id);
            this.contactDetails.splice(index, 1, response);
          }
        })
      }
    });
  }

  // Es llamado por el boton de nuevo contacto
  createNewContact() {
    const dialogRef = this.dialog.open(NewContactDetailDialogComponent, {
      autoFocus: false,
      data: { isEditing: false, userId: this.client.id }
    });

    //Después de crear un contacto satisfactoriamente lo agrega al accordion
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result != "") {
        //Agregamos el userId
        result['userId'] = this.client.id;
        this.isLoading = true;
        this.contactDetailsService.createOrUpdateContactDetail(result).subscribe(response => {
          this.isLoading = false;
          if (response)
            this.contactDetails.push(response);
        })
      }
    }, err => {
      this.isLoading = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
        'Error '
      );
    });
  }

  editCommunication(communication: Communication, index: number) {
    const dialogRef = this.dialog.open(NewCommunicationDialogComponent, {
      data: {
        contactDetails: this.contactDetails,
        clientContactDetails: this.clientContactDetails,
        isEditing: true,
        parent: this,
        communication
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result != "") {
        //Agregamos accountbalanceId y user
        result.AccountBalanceId = this.accountBalanceId;
        result.Client = this.client;
        result.ClientId = this.client.id;
        this.isLoading = true;
        this.communicationService.saveCommunication({
          communication: result,
          correoElectronico: this.correoElectronico
        }).subscribe(response => {
          if (response) //response es la communication editada
          {
            this.isLoading = false;
            response.ssoUser.roles = Array.from(new Set(_.map(response.ssoUser.roles, a => a.role))).join(', ');
            //Encuentro el índice de la communication modificada y con eso reemplazo a la anterior
            this.communications[index] = response;
          }
        })
      }
    }, err => {
        this.isLoading = false;
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
          'Error '
        );
    });
  }

  deleteCommunication(communicationId: number, index: number) {
    this.dialog.open(DialogConfirmDeleteContactDetailComponent, {
      data: {parent: this, isCommunication: true, communicationId, index}
    });
  }

  removeContact(id: number) {
    this.dialog.open(DialogConfirmDeleteContactDetailComponent, {
      data: {id, parent: this, isCommunication: false, title: "Comunicacion"}
    });
  }
  
  checkEmpty(str: string): string{
    return str && str.length > 0 ? str : '-';
  }

}

@Component({
  selector: 'app-new-contact-detail-dialog',
  templateUrl: './new-contact-detail-dialog.component.html',
  styleUrls: ['./new-contact-detail-dialog.component.scss']
})
export class NewContactDetailDialogComponent implements OnInit {

  isEditing: boolean;
  formGroup: FormGroup;
  eComChannelType = EComChannelType;
  title: string;
  CountryISO = CountryISO;

  phoneUtil: any;
  PNF: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewContactDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    this.PNF = require('google-libphonenumber').PhoneNumberFormat;
  }

  ngOnInit() {
    this.isEditing = this.data.isEditing;
    this.resetFormGroup();
  }

  resetFormValueInput(){
    console.log(this.formGroup.value.phoneInput)
    console.log(typeof this.formGroup.value.phoneInput)
    if (this.formGroup.value.commChannel == this.eComChannelType.Telefono){
      this.formGroup.patchValue({ phoneInput: "" });
    }
    else {
      this.formGroup.patchValue({ emailInput: "" });
    }
  }

  resetFormGroup() {

    let phoneNumberData: PhoneNumber = new PhoneNumber();
    let emailData: string = "";

    try{
      if (this.isEditing){
        let data = this.phoneUtil.parse(this.data.contactDetail.value);
        phoneNumberData.countryCode = this.phoneUtil.getRegionCodeForNumber(data);
        phoneNumberData.dialCode = "+" + data.getCountryCode();
        phoneNumberData.e164Number = this.phoneUtil.format(data, this.PNF.E164);
        phoneNumberData.internationalNumber = this.phoneUtil.format(data, this.PNF.INTERNATIONAL);
        phoneNumberData.nationalNumber = phoneNumberData.number = this.phoneUtil.format(data, this.PNF.NATIONAL);
      } 
    } catch {
      if (this.data.contactDetail.comChannel == this.eComChannelType.Telefono)
        phoneNumberData = this.data.contactDetail.value;
      else emailData = this.data.contactDetail.value;
    }

    this.title = this.isEditing ? "Editar Contacto": "Nuevo Contacto";
    this.formGroup = this.formBuilder.group({
      phoneInput: [phoneNumberData, [Validators.required]],
      emailInput: [emailData, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      commChannel: [this.isEditing ? this.data.contactDetail.comChannel : '', [Validators.required]],
      description: [this.isEditing ? this.data.contactDetail.description : '', [Validators.required]]
    });
  }

  send(formGrp: any) {
    let contactDetail = new ContactDetail();
    contactDetail.id = this.isEditing ? this.data.contactDetail.id : 0;
    contactDetail.description = formGrp.value.description;
    contactDetail.comChannel = formGrp.value.commChannel;
    contactDetail.value = contactDetail.comChannel == this.eComChannelType.Telefono ? formGrp.value.phoneInput.internationalNumber : formGrp.value.emailInput;
    contactDetail.userId = this.isEditing ? this.data.contactDetail.userId : this.data.userId;
    this.resetFormGroup();

    this.dialogRef.close(contactDetail);
  }

  validateEmail(){
    return this.formGroup.get('emailInput').valid;
  }

  checkValidForm(){
    if (this.formGroup.value.commChannel == this.eComChannelType.Telefono && this.formGroup.get('phoneInput').valid) return false;
    else if (this.formGroup.value.commChannel == this.eComChannelType.CorreoElectronico && this.validateEmail()) return false;
    return true;
  }
}

export interface DialogData {
  parent: CommunicationComponent;
  id: number;
  isCommunication: boolean;
  communicationId: number;
  index: number;
}

export class PhoneNumber{
  countryCode: string;
  dialCode: string;
  e164Number: string;
  internationalNumber: string;
  nationalNumber: string;
  number: string;
}