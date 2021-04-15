import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { Urls } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser(login:any){
    return this.http.post<LoginResponse>(Urls.BASE_URL+Urls.LOGIN, login);
  }
}
