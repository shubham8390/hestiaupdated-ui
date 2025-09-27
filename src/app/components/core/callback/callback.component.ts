import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../Services/auth.service';


@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './callback.component.html'
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      if (code) {
        const tokens = await this.authService.handleCallback(code);
        console.log('Google Tokens:', tokens);
        localStorage.setItem('google_tokens', JSON.stringify(tokens));
      }
    });
  }
}
