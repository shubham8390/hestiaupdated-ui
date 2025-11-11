// src/app/core/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  /** Helper to build headers for each request (merges default + extra). */
  private getHeaders(extra?: Record<string, string | null>): HttpHeaders {
    let headers = ApiService.defaultHeaders;
    if (!extra) {
      return headers;
    }

    // set or remove keys supplied in extra
    for (const key of Object.keys(extra)) {
      const value = extra[key];
      headers = value === null ? headers.delete(key) : headers.set(key, value as string);
    }
    return headers;
  }

  /** Centralised error handling */
  private handleError(error: HttpErrorResponse) {
    const message =
      error.error?.message ??
      (error.status ? `Server returned code ${error.status}` : 'Network error occurred');
    return throwError(() => new Error(message));
  }

  // ----------- API methods (examples corrected) ------------

  public getChatResponse(data: any): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}chat`;
    return this.http.post<any>(uri, data, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getHistoryofChat(sessionId: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}chat/${sessionId}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getchatHistoryList(sessionId: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/chat/sessions?project_id=${sessionId}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getAllChatHistory(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}chat/sessions?user_id=6872166531b8abcca37c2d2c`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getTaskDetails(id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/${id}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public uploadImage(file: File): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    // NOTE: when uploading FormData you usually must NOT set Content-Type (browser sets multipart boundary).
    const uri = `${this.apiUri}project/upload-image/`;
    const formData = new FormData();
    formData.append('file', file);
    // remove JSON content-type for FormData
    const uploadHeaders = headers.delete('Content-Type');
    return this.http.post<any>(uri, formData, { headers: uploadHeaders }).pipe(catchError((err) => this.handleError(err)));
  }

  public uploadDocuments(file: File): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/knowledge-base?user_id=6872166531b8abcca37c2d2c`;
    const formData = new FormData();
    // if endpoint expects 'files' param as array / multiple files adjust accordingly
    formData.append('files', file);
    const uploadHeaders = headers.delete('Content-Type');
    return this.http.post<any>(uri, formData, { headers: uploadHeaders }).pipe(catchError((err) => this.handleError(err)));
  }

  public savedProject(projectData: any): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project`;
    return this.http.post<any>(uri, projectData, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public updateProject(projectData: any, projectId: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project?project_id=${projectId}`;
    return this.http.put<any>(uri, projectData, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getProjectDetails(projectId: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project?project_id=${projectId}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getProjectList(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}projects?user_id=6872166531b8abcca37c2d2c`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public deleteProject(id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project?project_id=${id}`;
    return this.http.delete<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getPropertyList(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/property-list/`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  /// Project tasks
  public posttaskofProject(id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/?project_id=${id}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public updatetaskofProject(id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/?project_id=${id}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public deletealltaskofProject(id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/?project_id=${id}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getalltaskofProject(id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/tasks/?project_id=${id}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public deleteTaskbyId(taskid: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/${taskid}`;
    return this.http.delete<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public addprojecttask(taskdetails: any): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/`;
    return this.http.post<any>(uri, taskdetails, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public updateprojecttask(taskdetails: any, id: string): Observable<any> {
    // fixed placeholder {id} -> actual id param, and used put
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/task/${id}`;
    return this.http.put<any>(uri, taskdetails, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getCustomerChatResponse(data: any): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}customer/chat`;
    return this.http.post<any>(uri, data, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getCustomers(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}customer/customers`;
    // if you need to pass project_name, append ?project_name=...
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public addCustomer(addCustomer: any): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}customer/customers`;
    return this.http.post<any>(uri, addCustomer, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public authorizeUser(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}google/authorize`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getsampletemplate(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/flyer-templates`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public authorizeMicrosoftuser(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}microsoft/auth/login?source=local2`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public authorizeMicrosoftuserCallBack(code: string, email: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}auth/callback?code=${encodeURIComponent(code)}&state=microsoft365&current_user_email=${encodeURIComponent(email)}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getImageBlob(imageUrl: string): Observable<Blob> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    // responseType workaround for types: casting to 'json' is a common workaround used by Angular
    return this.http.get(imageUrl, { headers, responseType: 'blob' as 'json' }).pipe(catchError((err) => this.handleError(err)));
  }

  public createTemplateImageBlob(data: any): Observable<Blob> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/generate-flyer`;
    return this.http.post(uri, data, { headers, responseType: 'blob' as 'json' }).pipe(catchError((err) => this.handleError(err)));
  }

  public getstakeholderdata(name: string, id: string): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}project/stakeholders/?project_id=${id}&project_name=${encodeURIComponent(name)}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getJwtTokenForgoogle(nonce: string, provider = 'google'): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}/google/auth/token?nonce=${encodeURIComponent(nonce)}&provider=${encodeURIComponent(provider)}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public getJwtTokenForMicrosoft(nonce: string, provider = 'microsoft'): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}/microsoft/auth/token?nonce=${encodeURIComponent(nonce)}&provider=${encodeURIComponent(provider)}`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public logoutMicrosoft(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}microsoft/logout`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }

  public logoutgoogle(): Observable<any> {
    const headers = this.getHeaders({ 'ngrok-skip-browser-warning': 'true' });
    const uri = `${this.apiUri}/google/logout`;
    return this.http.get<any>(uri, { headers }).pipe(catchError((err) => this.handleError(err)));
  }
}
