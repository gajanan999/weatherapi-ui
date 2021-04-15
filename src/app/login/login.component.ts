import { Component, ElementRef, Renderer2, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { SignupService } from '../service/signup.service';
import { Router } from '@angular/router';

import {SessionStorageService} from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';

import {DateValidator} from '../shared/date.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  singninFrom: FormGroup
  singnupFrom:FormGroup

  @ViewChild("signInLink") signInLink:ElementRef; 

  constructor(private _formBuilder: FormBuilder, 
              private loginService : LoginService,
              private signupService:SignupService,
              private router:Router,
              private sessionStore:SessionStorageService,
              private toastrService:ToastrService,
              private renderer:Renderer2) {
    
   }

  ngOnInit() {
    this.singninFrom = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.singnupFrom = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
      birthdate: ['', Validators.compose([Validators.required, DateValidator.dateVaidator])]
    })
  }

  onLogin(){
    console.log(this.singninFrom);
    const controls = this.singninFrom.controls;
    if (this.singninFrom.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const loginRequest = {
      "username":controls.username.value,
      "password":controls.password.value
    }

    this.loginService.loginUser(loginRequest).subscribe(response =>{
        if(response.jwt == undefined || response.jwt==null){
          this.toastrService.error('Invalid Username or Password', 'Major Error', {
            timeOut: 2000,
          });
        }else{
          this.sessionStore.store('jwt-token',response.jwt);
          this.sessionStore.store('username',response.username);
          this.sessionStore.store('roles',response.roles);
          this.sessionStore.store('id',response.id);
          this.router.navigateByUrl('')
          this.toastrService.success("Login Successful", 'Success', {
            timeOut: 2000,
          });
        }

    }, err => {
      if(err.status == 401){
        this.toastrService.error("Invalid Username or Password", 'Major Error', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.error(err.message, 'Major Error', {
          timeOut: 2000,
        });
      }
     
    })
  }


  onSignUp(){
      console.log(this.singnupFrom);
      const controls = this.singnupFrom.controls;
      if (this.singnupFrom.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
        return;
      }

      const event = new Date(controls.birthdate.value);
      event.setDate(event.getDate() + 1)
      let date = JSON.stringify(event)
      date = date.slice(1,11)
      console.log(date);
      
      
    const signUpRequest = {
      "username":controls.username.value,
      "password":controls.password.value,
      "active":true,
      "roles":"ROLE_USER",
      "birthdate":date
    }

      this.signupService.signUpUser(signUpRequest).subscribe(response =>{
        if(response.code != "OK" || response.code==null){
          this.toastrService.error(response.message, 'Signup Failed', {
            timeOut: 2000,
          });
        }else{
          this.toastrService.success("Signup Successful, Please Login", 'Success', {
            timeOut: 2000,
          });
         // this.router.navigateByUrl('/login')
          let event = new MouseEvent('click', {bubbles: true});
          let el: HTMLElement = this.signInLink.nativeElement;
          el.click();
        }

    }, err => {
        if(err.error != undefined && err.error.message ==undefined){
          this.toastrService.error(err.error.message, 'Major Error', {
            timeOut: 2000,
          });
        }else{
          this.toastrService.error(err, 'Major Error', {
            timeOut: 2000,
          });
        }
       
    })
  }

  checkSignInField(field:string){
        if(!this.singninFrom.get(field)?.valid && this.singninFrom.get(field)?.touched){
            return true
        }
        return false
  }

  checkSignUpField(field:string){
    if(!this.singnupFrom.get(field)?.valid && this.singnupFrom.get(field)?.touched){
      return true
    }
    return false
  }


}
