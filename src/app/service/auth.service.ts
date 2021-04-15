import { Injectable } from '@angular/core';
import {SessionStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private sessionStore: SessionStorageService) { }

  LoggedIn() {
    const  token = this.sessionStore.retrieve('jwt-token');
    if(undefined != token || null != token){
      return true;
    }else{
      return false;
    }
  }

  getUsername(){
    const  username = this.sessionStore.retrieve('username');
    if(undefined != username || null != username){
      return username;
    }else{
      return '';
    }
    
  }
}
