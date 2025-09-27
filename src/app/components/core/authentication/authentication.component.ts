import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Services/auth.service';
import { ApiService } from '../Services/api.service';


@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  constructor(private authService: AuthService, private apiservice: ApiService) { }

  // signIn() {
  //   this.authService.signInWithGoogle();
  // }
  data: any

  // signIn(){
  //   this.apiservice.authorizeUser().subscribe(res=>{
  //     this.data=res;
  //       if (res && res.authorization_url) {
  //          //  window.open(res.authorization_url, '_blank');
  //     window.location.href = res.authorization_url;
  //   }
  //   })
  // }
  signIn() {
    window.location.href = 'https://barnacle-noble-nominally.ngrok-free.app/google/authorize';

  }
  signInwithMicrosoft() {
    // window.location.href = 'http://127.0.0.1:8000/google/authorize';

    this.apiservice.authorizeMicrosoftuser().subscribe(res => {
      this.data = res;
      if (res && res.login_url) {
        //  window.open(res.authorization_url, '_blank');
        window.location.href = res.login_url;
      }
    })
  }
}
