import { UserEdit } from './../../models/user-edit';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PrincipalService, StorageService } from 'src/app/core/auth';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {

  changePasswordForm: FormGroup;
  user: User;
  userDni: number;
  userAddress: string;
  users: Array<User>;
  currentUser: any;

  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog,
    public principalService: PrincipalService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.principalService.getIdentity().subscribe(resp => {
      this.currentUser = resp;
    });

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      nowPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
    this.userDni = this.currentUser.cuit.substring(2, 10);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (tabChangeEvent.index == 0) {
      this.changePasswordForm.reset();
    }
  }

  openDialogOKEditPass(): void {
    this.dialog.open(DialogInfoComponent, {
      maxWidth: '300px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Éxito',
        text: 'Se ha actualizado la contraseña correctamente.',
        icon: 'check_circle',
      }
    });
  }

  openDialogErrorEditPass(): void {
    this.dialog.open(DialogInfoComponent, {
      maxWidth: '450px',
      panelClass: 'dialog-responsive',
      data: {
        title: 'Error.',
        text: ' No se pudo realizar el cambio pues algunos de los datos ingresados no coinciden.',
        icon: 'error',
      }
    });
  }

  editPassword(formG: FormGroup) {
    const userEdit: UserEdit = new UserEdit();
    userEdit.email = this.currentUser.userEmail;
    userEdit.password = formG.value.currentPassword;
    userEdit.newPassword = formG.value.nowPassword;
    userEdit.ssoToken = this.storageService.getTokenSSO();

    this.userService.editPasswordUsers(userEdit).subscribe((result: any) => {
      this.openDialogOKEditPass();
      this.storageService.storeTokenSso(result.accessToken);
      this.storageService.storeTokenRefresh(result.refreshToken);
      this.changePasswordForm.reset();
    }, error => {
      this.openDialogErrorEditPass();
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('nowPassword').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

}