import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { toaster } from 'src/app/app.component';
import { CommunicationComponent, DialogData } from '../communication.component';
import { DialogInfoComponent } from '../../../dialog-info/dialog-info.component';
import * as _ from 'lodash'
import { ContactDetailService } from 'src/app/services/contact-detail.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { Communication } from 'src/app/models/communication';

@Component({
  selector: 'app-dialog-confirm-delete-contact-detail',
  templateUrl: './dialog-confirm-delete-contact-detail.component.html',
  styleUrls: ['./dialog-confirm-delete-contact-detail.component.scss']
})
export class DialogConfirmDeleteContactDetailComponent implements OnInit {

  parent: CommunicationComponent;
  // Para ContactDetail
  id: number; 
  // Para Communication
  communicationId: number;
  index: number;
  // ContactDetail or Communication?
  isCommunication: boolean;

  constructor(
    private contactDetailService: ContactDetailService,
    private communicationService: CommunicationService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogConfirmDeleteContactDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.parent = this.data.parent;
    this.isCommunication = this.data.isCommunication;
    this.communicationId = this.data.communicationId;
    this.index = this.data.index;
    
  }

  closePopUp(): void {
    this.dialogRef.close();
  }

  openDialog(): void {

    var text = `El contacto fue eliminado con éxito.`;
    if (this.isCommunication){
      text = `La comunicacion fue eliminada con éxito.`;
    }

    this.dialog.open(DialogInfoComponent, {
      maxWidth: '300px',
      panelClass: 'dialog-responsive',
      data: {text: text, icon: "check_circle"}
    });
  }

  deleteContactDetail(){
    this.parent.isLoading = true; 
    this.closePopUp();
    this.contactDetailService.removeContactDetail(this.id).subscribe(x => {
      this.parent.isLoading = false;
      if(x) {
        _.remove(this.parent.contactDetails, cd => cd.id=== this.id);
        this.parent.updateCommunications();
        this.openDialog();
      }
      else
        console.log('El contactDetail no se pudo borrar');
    }, err => {
      this.parent.isLoading = false;
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
        'Error '
      );
    })
  }

  deleteCommunication(){
    this.parent.isLoading = true; 
    this.closePopUp()
    this.communicationService.deleteCommunication(this.communicationId).subscribe(response => {
      if (response)
      {
        this.parent.isLoading = false; 
        this.parent.communications.splice(this.index, 1);
        this.parent.ngOnInit();
      }
    }, err => {
      this.parent.isLoading = false; 
      toaster.error(
        `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
        'Error'
      );
    })
  }
}
