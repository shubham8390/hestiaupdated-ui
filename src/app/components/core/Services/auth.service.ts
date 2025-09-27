import { Injectable } from '@angular/core';
import { googleAuthConfig } from './google-auth.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private codeVerifier: string = '';

  constructor() {}

  // Generate a random string for PKCE
  private generateCodeVerifier(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async generateCodeChallenge(verifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(digest);
  }

  private base64UrlEncode(arrayBuffer: ArrayBuffer) {
    let str = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

async signInWithGoogle() {
  this.codeVerifier = this.generateCodeVerifier(128);
  localStorage.setItem('code_verifier', this.codeVerifier);

  const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

  const params = new URLSearchParams({
    client_id: googleAuthConfig.client_id,
    redirect_uri: googleAuthConfig.redirect_uri,
    response_type: 'code',
    scope: googleAuthConfig.scope, // now without offline_access
    access_type: 'offline',  // this is the correct way
    prompt: 'consent',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  window.location.href = `${googleAuthConfig.auth_uri}?${params.toString()}`;
}


  async handleCallback(code: string) {
    const verifier = localStorage.getItem('code_verifier')!;
    const body = new URLSearchParams({
      client_id: googleAuthConfig.client_id,
      client_secret: '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', // ⚠ keep safe in backend ideally
      code: code,
      redirect_uri: googleAuthConfig.redirect_uri,
      grant_type: 'authorization_code',
      code_verifier: verifier
    });

    const res = await fetch(googleAuthConfig.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    return res.json(); // { access_token, refresh_token, expires_in, ... }
  }
}
