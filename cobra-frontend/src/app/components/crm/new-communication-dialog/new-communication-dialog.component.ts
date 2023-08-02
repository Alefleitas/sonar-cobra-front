import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { EComChannelType, ECommunicationResult, Communication, ContactDetail } from 'src/app/models/communication';

@Component({
  selector: 'app-new-communication-dialog',
  templateUrl: './new-communication-dialog.component.html',
  styleUrls: ['./new-communication-dialog.component.scss']
})
export class NewCommunicationDialogComponent implements OnInit {

  formGroup: FormGroup;
  eComChannelType = EComChannelType;
  eCommunicationResult = ECommunicationResult;
  isEditing: boolean;
  isLoading = false;
  communication: Communication;
  maxMinDate = moment();
  title: string;



  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewCommunicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.isEditing == true)
      this.communication = data.communication;
  }

  ngOnInit() {
    this.title = this.data.isEditing? "Editar Comunicacion": "Nueva Comunicacion";
    if (this.data.isEditing) {
      this.formGroup = this.formBuilder.group({
        id: [this.data.communication.id],
        date: [{ value: this.data.communication.date, disabled: true}, [Validators.required]],
        communicationResult: [this.data.communication.communicationResult, [Validators.required]],
        description: [this.data.communication.description, [Validators.required]],
        nextCommunicationDate: [this.data.communication.nextCommunicationDate],
        communicationChannel: [this.data.communication.communicationChannel, [Validators.required]],
        contactDetail: ['-2', [Validators.required]]  // Asumo que es de oracle (-2)
      });
    }
    else {
      this.formGroup = this.formBuilder.group({
        id: [0],
        date: ['', [Validators.required]],
        communicationResult: ['', [Validators.required]],
        communicationChannel: ['', [Validators.required]],
        description: ['', [Validators.required]],
        nextCommunicationDate: [],
        contactDetail: ['', [Validators.required]]
      });
    }
  }
 
  send(formGrp: any) {
    let communication = new Communication();
    communication.id = formGrp.value.id;
    communication.date = this.data.isEditing ? this.data.communication.date : this.createDateAsUTC(new Date(formGrp.value.date));
    communication.nextCommunicationDate = this.createDateAsUTC(new Date(formGrp.value.nextCommunicationDate));
    communication.description = formGrp.value.description;
    communication.communicationResult = formGrp.value.communicationResult;
    communication.communicationChannel = formGrp.value.communicationChannel;

    // Se volvio a elegir el mismo contacto de oracle
    if (this.data.isEditing && this.communication.contactDetailId != null && formGrp.value.contactDetail == -2) {
      communication.contactDetailId = this.communication.contactDetailId;}

    // Si se cumple indica que se elgio un contacto de la db
    if (formGrp.value.contactDetail > 0) {
      communication.contactDetailId = formGrp.value.contactDetail;}

    // Corrije la fecha proxima de comunicación
    if (communication.nextCommunicationDate <  new Date(2021)){
      communication.nextCommunicationDate = null;
    }
    

      
    this.dialogRef.close(communication);
  }

  createDateAsUTC(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  descriptionInvalid(): boolean {
    return this.formGroup.controls['description'].invalid && (this.formGroup.controls['description'].dirty || this.formGroup.controls['description'].touched);
  }
}
