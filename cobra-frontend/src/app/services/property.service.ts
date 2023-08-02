import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property } from '../models';
import { RequestService } from '../core/services';
import { Observable } from 'rxjs';
import { PropertyAdvance } from '../models/property-advance.model';
@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor( private requestService: RequestService) { }

  getPropertyCodes(): Observable<Property[]> {
    return this.requestService.get("payments/getPropertyCodes");
  }

  getPropertySummaryCodes(): Observable<Property> {
    return this.requestService.get("payments/getPropertyCodesForSummary");
  }

  getPropertyCodesFull(): Observable<Property[]> {
    return this.requestService.get("payments/GetPropertyCodesFull");
  }

  getPropertyCodesForAdvance(): Observable<PropertyAdvance> {
    return this.requestService.get("payments/getPropertyCodesForAdvance");
  }
}
