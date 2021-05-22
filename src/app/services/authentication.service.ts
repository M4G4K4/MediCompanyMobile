import {Injectable} from '@angular/core';

import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';

import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {email; password}): Observable<any> {
    return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => from(Storage.set({key: TOKEN_KEY, value: token}))),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );
  }

  register(credentialsRegister: {name, email, password}): Observable<any>{
    console.log(credentialsRegister);
    return this.http.post(`https://reqres.in/api/register`, credentialsRegister).pipe(
      map((data: any) => data.token),
      switchMap(token => from(Storage.set({key: TOKEN_KEY, value: token}))),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }
}
