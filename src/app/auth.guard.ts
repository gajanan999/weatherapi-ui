import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router:Router, private authService:AuthService){

  }

  canActivate(): boolean {

      if(this.authService.LoggedIn()){
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }

  }
  
}
