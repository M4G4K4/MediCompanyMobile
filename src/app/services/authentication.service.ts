import {Injectable} from '@angular/core';

import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';

import {Plugins} from '@capacitor/core';
import {environment} from 'src/environments/environment';

const { Storage } = Plugins;
const TOKEN = 'token';

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
    const token = await Storage.get({ key: TOKEN });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {email; password}): Observable<any> {
    return this.http.post(environment.baseURL + '/login', credentials).pipe(
      map((data: any) => data.api_token),
      switchMap(token => from(Storage.set({key: TOKEN, value: token}))),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );
  }

  register(credentialsRegister: {name, email, password}): Observable<any>{
    console.log(credentialsRegister);
    return this.http.post(environment.baseURL + `/register`, credentialsRegister).pipe(
      map((data: any) => data.token),
      switchMap(token => from(Storage.set({key: TOKEN, value: token}))),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );
  }

  saveInfo(credentialsSaveInfo: {fullName,age,sex,NIF}, header): Observable<any>{
    console.log(credentialsSaveInfo);
    console.log(header);
    const request = this.http.post(environment.baseURL + `/fillDetails`, credentialsSaveInfo,header);
    return request;
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN});
  }
}
