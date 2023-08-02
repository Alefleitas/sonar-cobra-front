import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { StorageService } from '../auth/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request || !request.url) {
      return next.handle(request);
    }

    const token = this.storageService.getToken();
    const tokenSSO = this.storageService.getTokenSSO();
    if (!!token) {
      request = request.clone({
        // setHeaders: { Authorization: 'Bearer ' + token }
        setHeaders: {
          Authorization: token,
        }
      });
    } else {
      if (!!tokenSSO) {
        request = request.clone({
          // setHeaders: { Authorization: 'Bearer ' + token }
          setHeaders: {
            SsoToken: tokenSSO
          }
        });
      }
    }
    return next.handle(request);
  }
}
