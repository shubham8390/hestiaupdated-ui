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
      var code = params['code'];
      sessionStorage.setItem('token', code);
      this.callapi(code);
    });

  }

  callapi(code: any) {

    this.apiService.authorizeMicrosoftuserCallBack(code, 'pratikraut@icode.com').subscribe(res => {
      this.data = res;
      sessionStorage.setItem('jwt',this.data.id_token);
      setTimeout(() => {
         this.router.navigate(['/chat']);
      }, 10);
    })
    
  }
}

