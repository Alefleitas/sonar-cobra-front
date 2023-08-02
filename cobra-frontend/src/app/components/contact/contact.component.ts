import { Contact } from './../../models/contact';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrincipalService } from 'src/app/core/auth';
import { PropertyService } from 'src/app/services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { Property } from 'src/app/models';
import { ContactService } from 'src/app/services/contact.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  formGroup: FormGroup;
  currentUser: any;
  properties: any
  affairs: Array<Property>;
  affairsLoaded: boolean = false;
  sendingMessage: boolean = false;
  contact: Contact;
  filesToUpload: File[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private principalService: PrincipalService,
    private propertyService: PropertyService,
    public dialog: MatDialog,
    public contactService: ContactService,

  ) { }

  ngOnInit() {
    this.affairs = new Array<Property>();
    this.getData();

    this.formGroup = this.formBuilder.group({
      name: [this.currentUser.firstname, [Validators.required]],
      phone: [],
      email: [this.currentUser.userEmail, [Validators.required]],
      affair: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  send(formGrp: any) {
    this.sendingMessage = true;
    this.contact = new Contact();
    this.contact.name = formGrp.value.name;
    this.contact.tel = formGrp.value.phone;
    this.contact.email = formGrp.value.email;
    this.contact.product = formGrp.value.affair.productCode;
    this.contact.message = formGrp.value.message;
    this.contact.cuit = formGrp.value.affair.cuitEmpresa;

    this.contactService.send(this.contact, this.filesToUpload).subscribe(
      res => {
        this.sendingMessage = false;
        this.sendOpenDialog();
      },
      error => {
        this.sendingMessage = false;
        this.sendOpenDialogError('Error al enviar el Mensaje');
      }
  );

  this.formGroup.reset();

    this.formGroup = this.formBuilder.group({
      name: [this.currentUser.firstname, [Validators.required]],
      phone: ['',],
      email: [this.currentUser.userEmail, [Validators.required]],
      affair: [, [Validators.required]],
      message: ['', [Validators.required]],
    });
    this.filesToUpload = [];
  }

  getData() {
    this.propertyService.getPropertyCodes().subscribe((res: any) => {
      this.affairsLoaded = true;
      res.forEach(element => {
        this.affairs.push(element);
        this.affairs = _.sortBy(this.affairs, el => el.emprendimiento);
      });
    }
      , error => {
        this.sendOpenDialogError("Error al cargar productos");
      }
    );
    this.principalService.getIdentity().subscribe(resp => {
      this.currentUser = resp;
    });
  }

  sendOpenDialog(): void {
    const text = "Mensaje Enviado<br /><br />Nos contactaremos con usted a la brevedad";
    const dialogRef = this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        icon: 'check_circle',
        text: text
      }
    });
  }

  sendOpenDialogError(titulo: string): void {
    const text = titulo + "<br /><br />Por favor reintente más tarde.";
    const dialogRef = this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        icon: 'error',
        text: text
      }
    });
  }

  handleFileInput(files: FileList) {
    this.filesToUpload = [];
    _.forEach(files, x=>this.filesToUpload.push(x));
  }

}
