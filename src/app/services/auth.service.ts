import { Injectable } from '@angular/core';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

import { AUTH_CONFIG } from '../../environments/auth-env';
import { BehaviorSubject } from 'rxjs';

const COMMON_ROOT = 'http://35.200.194.225:8000';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // Web auth service.
  private Auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });

  // Objects
  accessToken: String;
  expiresAt: number;

  loggedIn$ = new BehaviorSubject<boolean>(false);
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }


  private setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
  }

  login(): void {
    this.Auth0.authorize();
  }

  private setSession(authResult) {
    // Set access token and expiry
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', JSON.stringify(authResult.accessToken));
    localStorage.setItem('expires_at', (expiresAt));
    this.setLoggedIn(true);

    this.http.get(COMMON_ROOT + '/token')
    .pipe(res => res,
    retry(2),
    catchError(this.handleError));

    return this.http.post(COMMON_ROOT + '/signin',
      {
        'access_token': authResult.accessToken
      },
      {
        withCredentials: true
      })
      .pipe(map(res => {
        return res;
      }),
      catchError(this.handleError)
      );
  }

  handleLoginCallback(): void {
    this.Auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.setSession(authResult)
        .subscribe(res => {
          // console.log('Set Session', res);
          this.router.navigate(['/profile']); },
          error  => this.router.navigate(['/'])
        );
      } else if (err) {
        console.error(`Error: ${err.error}`);
        this.router.navigate(['/']);
      }
   });
  }

  logout() {
    // Logout the user.
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    return this.http.get(COMMON_ROOT + '/signout',
    {
      withCredentials: true
    })
    .subscribe(res => {
      this.router.navigate(['/']);
    },
    err => console.log(err));
  }

  public authenticated(): boolean {
    // Check whether the user is logged in.
    const expiresAt = (JSON.parse(localStorage.getItem('expires_at')));
    const access_token = (localStorage.getItem('access_token'));
    // console.log(access_token != null);
    return ( new Date().getTime() < expiresAt ) && (access_token != null);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

