import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";
import { RequestService } from '../core/services';


@Injectable({
    providedIn: 'root'
  })
export class ProductService {

    constructor(private requestService: RequestService) { }

    getProducts(): Observable<Product[]> {
        return this.requestService.get('AccountBalance/GetUserProducts');
      }

}
