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
  private apiUri = environment.apiBaseUrl;
  /** Global request headers (extend or override per call if needed). */
  private static readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });



  public getChatResponse(data: any): Observable<any> {
    let uri = `${this.apiUri}chat`
    return this.http.post<any>(uri, data);
  }

  public getHistoryofChat(sessionId: any): Observable<any> {
    let uri = `${this.apiUri}chat/${sessionId}`
    return this.http.get<any>(uri);
  }

  public getchatHistoryList(sessionId: any): Observable<any> {
    let uri = `${this.apiUri}project/chat/sessions?project_id=${sessionId}`
    return this.http.get<any>(uri);
  }

  public getAllChatHistory(): Observable<any> {
    let uri = `${this.apiUri}chat/sessions?user_id=6872166531b8abcca37c2d2c`
    return this.http.get<any>(uri);
  }

  public getTaskDetails(id: any): Observable<any> {
    let uri = `${this.apiUri}project/task/${id}`
    return this.http.get<any>(uri);
  }


  public uploadImage(file: File): Observable<any> {
    const uri = `${this.apiUri}project/upload-image/`;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(uri, formData);
  }




  public uploadDocuments(file: File): Observable<any> {
    const uri = `${this.apiUri}project/knowledge-base?user_id=6872166531b8abcca37c2d2c`;
    const formData = new FormData();
    formData.append('files', file);

    return this.http.post<any>(uri, formData);
  }


  public savedProject(projectData: any): Observable<any> {
    const uri = `${this.apiUri}project`;
    return this.http.post<any>(uri, projectData);
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


  public updateProject(projectData: any, projectId: any): Observable<any> {
    const uri = `${this.apiUri}project?project_id=${projectId}`;
    return this.http.put<any>(uri, projectData);
  }

  public getProjectDetails(projectId: any): Observable<any> {
    let uri = `${this.apiUri}project?project_id=${projectId}`
    return this.http.get<any>(uri);
  }

  public getProjectList(): Observable<any> {
    let uri = `${this.apiUri}projects?user_id=6872166531b8abcca37c2d2c`
    return this.http.get<any>(uri);
  }


  public deleteProject(id: any): Observable<any> {
    let uri = `${this.apiUri}project?project_id=${id}`
    return this.http.delete<any>(uri);
  }


  public getPropertyList(): Observable<any> {
    let uri = `${this.apiUri}project/property-list/`
    return this.http.get<any>(uri);
  }

  /// Project taks by  Pratik
  public posttaskofProject(id: any): Observable<any> {
    let uri = `${this.apiUri}project/task/?project_id=${id}`
    return this.http.get<any>(uri);
  }

  public updatetaskofProject(id: any): Observable<any> {
    let uri = `${this.apiUri}project/task/?project_id=${id}`
    return this.http.get<any>(uri);
  }
  public deletealltaskofProject(id: any): Observable<any> {
    let uri = `${this.apiUri}project/task/?project_id=${id}`
    return this.http.get<any>(uri);
  }
  public getalltaskofProject(id: any): Observable<any> {
    let uri = `${this.apiUri}project/tasks/?project_id=${id}`
    return this.http.get<any>(uri);
  }
  public deleteTaskbyId(taskid: any): Observable<any> {
    let uri = `${this.apiUri}project/task/${taskid}`
    return this.http.delete<any>(uri);
  }

  public addprojecttask(taskdetails: any): Observable<any> {

    let uri = `${this.apiUri}project/task/`
    return this.http.post<any>(uri, taskdetails);
  }


  public updateprojecttask(taskdetails: any): Observable<any> {
    let uri = `${this.apiUri}project/task/{id}`
    return this.http.put<any>(uri, taskdetails);
  }


  public getCustomerChatResponse(data: any): Observable<any> {
    let uri = `${this.apiUri}customer/chat`
    return this.http.post<any>(uri, data);
  }

  //Pratik
  public getCustomers(): Observable<any> {
    let uri = `${this.apiUri}customer/customers?project_name`
    console.log(this.http.get<any>(uri));
    return this.http.get<any>(uri);
  }

  public addCustomer(addCutomer: any): Observable<any> {
    let uri = `${this.apiUri}customer/customers`
    return this.http.post<any>(uri, addCutomer);
  }

  public authorizeUser(): Observable<any> {
    let uri = `${this.apiUri}google/authorize`
    return this.http.get<any>(uri);
  }

  public authorizeMicrosoftuser(): Observable<any> {
    let uri = `${this.apiUri}microsoft/auth/login?source=local2`
    return this.http.get<any>(uri);
  }
  public authorizeMicrosoftuserCallBack(code:any, email:any): Observable<any> {
    let uri = `${this.apiUri}auth/callback?code=${code}&state=microsoft365&current_user_email=${email}`
    return this.http.get<any>(uri);
  }

}

