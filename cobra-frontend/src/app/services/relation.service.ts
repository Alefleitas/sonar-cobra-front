import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private http: HttpClient) { }
  public getRelations()  {
    return this.http.get('valorURL').toPromise();
  }
}
