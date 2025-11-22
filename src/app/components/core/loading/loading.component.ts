import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {
  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }
  data: any;


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const nonce = params['nonce'];
      const provider = params['provider'];

      this.callapi(nonce,provider);
    });

  }

  callapi(nonce: any,provider:any) {
     sessionStorage.setItem('provider',provider);
    if(provider==='google'){
      debugger;
      this.apiService.getJwtTokenForgoogle(nonce,provider).subscribe(res=>{
        this.data=res;
       sessionStorage.setItem('jwt',this.data.token);
       this.router.navigate(['/chat']);
      },error=>{
      this.router.navigate(['/sign']);
      })
    }


     if(provider==='microsoft'){
      this.apiService.getJwtTokenForMicrosoft(nonce,provider).subscribe(res=>{
        this.data=res;
       sessionStorage.setItem('jwt',this.data.token);
       this.router.navigate(['/chat']);
      },error=>{
      this.router.navigate(['/sign']);
      })
    }


    // this.apiService.authorizeMicrosoftuserCallBack(code, 'pratikraut@icode.com').subscribe(res => {
    //   this.data = res;
    //   sessionStorage.setItem('jwt',this.data.id_token);
    //   setTimeout(() => {
    //      this.router.navigate(['/chat']);
    //   }, 10);
    // })
     //this.router.navigate(['/chat']);
  }
}

