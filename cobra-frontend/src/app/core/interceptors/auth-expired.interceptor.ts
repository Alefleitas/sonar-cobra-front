import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginService } from './../auth';
import { Router } from '@angular/router';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  
  constructor(
    private loginService: LoginService,
    private router: Router
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => { },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if ((error.status == 401 || error.status == 403) && this.router.url !== "/quick-access-quotations") this.loginService.logout();
          }
        }
      )
    );
  }
}
