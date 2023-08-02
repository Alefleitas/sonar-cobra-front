import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadFilesService {

    private httpOptions: any;
    private baseURL = environment.baseURL;

    constructor(private http: HttpClient) { }

    upload(file: File, fileName?: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        return this.http.post(`${this.baseURL}upload/upload`, formData, this.httpOptions)
            .pipe(
                tap(data => data),
                catchError(this.handleError<any>('Error uploading file'))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error.error.message); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            throw error;
        };
    }

}
