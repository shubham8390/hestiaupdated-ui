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
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}chat`
    return this.http.post<any>(uri, data,{headers: headers});
  }

  public getHistoryofChat(sessionId: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}chat/${sessionId}`
    return this.http.get<any>(uri,{headers});
  }

  public getchatHistoryList(sessionId: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/chat/sessions?project_id=${sessionId}`
    return this.http.get<any>(uri,{headers});
  }

  public getAllChatHistory(): Observable<any> {
    let userId = localStorage.getItem("user_id");
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}chat/sessions?user_id=${userId}`
    return this.http.get<any>(uri,{headers});
  }

  public getTaskDetails(id: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/task/${id}`
    return this.http.get<any>(uri,{headers});
  }


  public uploadImage(file: File): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    const uri = `${this.apiUri}project/upload-image/`;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(uri, formData,{headers: headers});
  }




  public uploadDocuments(file: File): Observable<any> {
    let userId = localStorage.getItem("user_id");
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    const uri = `${this.apiUri}project/knowledge-base?user_id=${userId}`;
    const formData = new FormData();
    formData.append('files', file);

    return this.http.post<any>(uri, formData,{headers: headers});
  }


  public savedProject(projectData: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    const uri = `${this.apiUri}project`;
    return this.http.post<any>(uri, projectData,{headers: headers});
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
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    const uri = `${this.apiUri}project?project_id=${projectId}`;
    return this.http.put<any>(uri, projectData,{headers: headers});
  }

  public getProjectDetails(projectId: any): Observable<any> {
    let uri = `${this.apiUri}project?project_id=${projectId}`
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    return this.http.get<any>(uri,{headers});
  }

  public getProjectList(): Observable<any> {
    let userId = localStorage.getItem("user_id");
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}projects?user_id=${userId}`
    return this.http.get<any>(uri,{headers});
  }


  public deleteProject(id: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project?project_id=${id}`
    return this.http.delete<any>(uri,{headers});
  }


  public getPropertyList(): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/property-list/`
    return this.http.get<any>(uri,{headers});
  }

  /// Project taks by  Pratik
  public posttaskofProject(id: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/task/?project_id=${id}`
    return this.http.get<any>(uri,{headers});
  }

  public updatetaskofProject(id: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/task/?project_id=${id}`
    return this.http.get<any>(uri,{headers});
  }
  public deletealltaskofProject(id: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/task/?project_id=${id}`
    return this.http.get<any>(uri,{headers});
  }
  public getalltaskofProject(id: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}tasks/?project_id=${id}`
    return this.http.get<any>(uri,{headers});
  }
  public deleteTaskbyId(taskid: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/?id=${taskid}`
    return this.http.delete<any>(uri,{headers});
  }

  public deleteProjectTaskSubTask(taskid: any,subTaskId:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/subtask/?task_id=${taskid.task_id}&subtask_id=${subTaskId}`
    return this.http.delete<any>(uri,{headers});
  }


    public MoveTaskbyId(taskid: any,status:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/move?task_id=${taskid}&status=${status}`
    return this.http.patch<any>(uri,{headers});
  }

  public addprojecttask(taskdetails: any,projetid:any): Observable<any> {
 const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/?project_id=${projetid}`
    return this.http.post<any>(uri, taskdetails,{headers: headers});
  }

    public addprojecttasksubtask(taskdetails: any,taskId:any): Observable<any> {
 const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/subtask/?task_id=${taskId}`
    return this.http.post<any>(uri, taskdetails,{headers: headers});
  }


  public updateprojecttask(taskdetails: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/`
    return this.http.put<any>(uri, taskdetails,{headers: headers});
  }
  
    public updateprojectSubtask(taskdetails: any,taskId:any,subTaskId:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}task/subtask/?task_id=${taskId.task_id}&subtask_id=${subTaskId}`
    return this.http.put<any>(uri, taskdetails,{headers: headers});
  }


  public getCustomerChatResponse(data: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}customer/chat`
    return this.http.post<any>(uri, data,{headers: headers});
  }

  //Pratik
  public getCustomers(): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}customer/customers?project_name`
    console.log(this.http.get<any>(uri));
    return this.http.get<any>(uri,{headers});
  }

  public addCustomer(addCutomer: any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}customer/customers`
    return this.http.post<any>(uri, addCutomer,{headers: headers});
  }

  public authorizeUser(): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}google/authorize`
    return this.http.get<any>(uri,{headers});
  }

    public getsampletemplate(): Observable<any> {
      
    let uri = `${this.apiUri}project/flyer-templates`
     const headers = new HttpHeaders({
    "ngrok-skip-browser-warning": "true"
  });

    return this.http.get<any>(uri,{ headers });
  }


public authorizeMicrosoftuser(): Observable<any> {
  const uri = `${this.apiUri}microsoft/auth/login?source=local2`;

  const headers = new HttpHeaders({
    "ngrok-skip-browser-warning": "true"
  });

  return this.http.get<any>(uri, { headers });
}
  public authorizeMicrosoftuserCallBack(code:any, email:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}auth/callback?code=${code}&state=microsoft365&current_user_email=${email}`
    return this.http.get<any>(uri,{headers});
  }

  getImageBlob(imageUrl: string): Observable<Blob> {
  const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
  return this.http.get(imageUrl, { headers, responseType: 'blob' });
}

createTemplateImageBlob(data: any): Observable<any> {
   const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
  const uri = `${this.apiUri}project/generate-flyer`;
  return this.http.post(uri, data, { headers: headers, responseType: 'blob' as 'json' });
}

  //Pratik
  public getstakeholderdata(name:any,id:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}project/stakeholders/?project_id=${id}&project_name=${name}`
  
    return this.http.get<any>(uri,{headers});
  }

   public getJwtTokenForgoogle(nonce:any,provider:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}google/auth/token?nonce=${nonce}&provider=google`
  
    return this.http.get<any>(uri,{headers});
  }

   public getJwtTokenForMicrosoft(nonce:any,provider:any): Observable<any> {
     const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}microsoft/auth/token?nonce=${nonce}&provider=microsoft`
  
    return this.http.get<any>(uri,{headers});
  }
    public logoutMicrosoft(): Observable<any> {
       const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}microsoft/logout`
  
    return this.http.get<any>(uri,{headers});
  }

    public logoutgoogle(): Observable<any> {
       const headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });
    let uri = `${this.apiUri}/google/logout`
  
    return this.http.get<any>(uri,{headers});
  }


}

