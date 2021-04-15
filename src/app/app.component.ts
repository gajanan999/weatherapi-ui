import { Component } from '@angular/core';
import {SessionStorageService} from 'ngx-webstorage';
import { AuthService } from './service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weatherapi-ui';

  constructor(private sessionStore:SessionStorageService, private authService:AuthService){
     
  }
  
  logout(){
    this.sessionStore.clear();
  }

  isLoggedIn(){
    return this.authService.LoggedIn();
  }

  getUserName(){
    return this.authService.getUsername()
  }
}
