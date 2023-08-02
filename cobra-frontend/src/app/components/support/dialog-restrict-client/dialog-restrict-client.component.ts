import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "lodash"
import { UserRestrictions } from 'src/app/models/user-restrictions';
import { SupportService } from 'src/app/services/support.service';
import {EPermission} from "../../../models/role"
import { toaster } from 'src/app/app.component';


@Component({
  selector: 'app-dialog-restrict-client',
  templateUrl: './dialog-restrict-client.component.html',
  styleUrls: ['./dialog-restrict-client.component.scss']
})
export class DialogRestrictClientComponent implements OnInit {

  oldPermissionsDeniedCodes: EPermission[];
  isLoading: boolean;
  makingPetition: boolean = false;
  madeChanges: boolean = true;
  disabledSliders: boolean = true;

  // SLIDERS
  advancePaymentSlider: boolean = false;

  constructor(
    private supportService: SupportService, 
    public dialogRef: MatDialogRef<DialogRestrictClientComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.supportService.getRestrictionsListByUserId(this.data.userId).subscribe(
      restrictionsList => {
        this.oldPermissionsDeniedCodes = restrictionsList.map(e => e.permissionDeniedCode);
        this.disabledSliders = false;
        this.isLoading = false;

        // Initialize toogle sliders
        if (!_.isEmpty(this.oldPermissionsDeniedCodes)) {
          this.oldPermissionsDeniedCodes.some(e => e === EPermission.Access_AdvancePayments) ? this.advancePaymentSlider = true : null;
        }
      }, 
      err => {
        this.isLoading = false;
        toaster.error(
          `Póngase en contacto con su administrador para obtener más información: ${err.message}`,
          'Error '
        );
      }
    );
  }

  saveChanges() {
    let newPermissionsDeniedCodes: EPermission[] = []
    if (this.advancePaymentSlider){
      newPermissionsDeniedCodes.push(EPermission.Access_AdvancePayments)
    }
    // If the user hasn't made any changes, close dialog
    if (_.isEqual(this.oldPermissionsDeniedCodes, newPermissionsDeniedCodes)){
      this.madeChanges = false;
    } else {
      this.madeChanges = true;
      this.makingPetition = true;
    }

    let gotRestrictions: boolean = true;

    // If there are no permissions denied, delete all the ones the user may have in the database
    if (newPermissionsDeniedCodes.length === 0 && this.madeChanges) {
      gotRestrictions = false;
      this.supportService.deleteRestrictionsByUserId(this.data.userId).subscribe(_ => {
        toaster.success(
          `Se actualizaron las restricciones al cliente: ${this.data.razonSocial}`,
          'Éxito '
        );
        this.dialogRef.close()
        return
      })
    }

    if (gotRestrictions && this.madeChanges) {
      const newRestrictionsList: UserRestrictions[] = newPermissionsDeniedCodes.map(e => {
        return {userId: this.data.userId, permissionDeniedCode: e}
      })

      this.supportService.postRestrictionsList(newRestrictionsList).subscribe(e => {
        if (e) {
          toaster.success(
            `Se actualizaron las restricciones al cliente: ${this.data.razonSocial}`,
            'Éxito '
          );
        } else {
          toaster.error(
            `No se pudieron actualizar las restricciones al cliente: ${this.data.razonSocial}`,
            'Error '
          );
        }
        this.dialogRef.close();
      })
    }
  }

}
