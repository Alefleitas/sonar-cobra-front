import { UserEdit } from "./../models/user-edit";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RequestService } from "../core/services";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient,
    private requestService: RequestService,
    private cookieService: CookieService
  ) {}

  public editPasswordUsers(userEdit: UserEdit): Observable<UserEdit> {
    return this.requestService.post("login/changePassword", userEdit);
  }
}
