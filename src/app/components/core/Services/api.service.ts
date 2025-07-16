// src/app/core/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../../../environment';          // ↳ path alias is optional
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ApiService {
  /* Angular 17 “functional DI” */
  private readonly http = inject(HttpClient);
    private apiUri=environment.apiBaseUrl;
  /** Global request headers (extend or override per call if needed). */
  private static readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  

  public getChatResponse(data:any):Observable<any>{
    let uri=`${this.apiUri}chat`
     return this.http.post<any>(uri, data);
  }

  public getHistoryofChat(sessionId:any):Observable<any>{
    let uri=`${this.apiUri}chat/${sessionId}`
    return this.http.get<any>(uri);
  }

    public getAllChatHistory():Observable<any>{
    let uri=`${this.apiUri}chat/sessions?user_id=6872166531b8abcca37c2d2c`
    return this.http.get<any>(uri);
  }



  /** Centralised error handling */
  private handleError(error: HttpErrorResponse) {
    // TODO: extend with Sentry/NewRelic, toast notifications, etc.
    const message =
      error.error?.message ??
      (error.status
        ? `Server returned code ${error.status}`
        : 'Network error occurred');
    return throwError(() => new Error(message));
  }
}
