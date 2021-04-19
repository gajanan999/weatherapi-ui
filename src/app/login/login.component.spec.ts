import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppRoutingModule } from '../app-routing.module';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { ToastrModule } from 'ngx-toastr';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports:[
        ReactiveFormsModule,
        HttpClientTestingModule,
        AppRoutingModule,
        NgxWebstorageModule.forRoot(),
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to login', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    spyOn(component,'onLogin').and.callFake(function(){});
    compiled.querySelector('#username').innerHtml = "admin"
    compiled.querySelector('#password').innerHtml = "admin"
    compiled.querySelector('#signInBtn').click()
    fixture.detectChanges();
    expect(component.onLogin).toHaveBeenCalled();

  });
 
});
