import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SignUpResponse } from '../models/SignUpResponse';
import { Urls } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  signUpUser(signupRequest:any){
    return this.http.post<SignUpResponse>(Urls.BASE_URL+Urls.SIGNUP, signupRequest);
  }
}
