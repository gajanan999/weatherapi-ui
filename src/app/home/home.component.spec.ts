import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        ReactiveFormsModule,
        NgxWebstorageModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return only date', () => {
    const unitTime = 1618760072
    let date = component.getDate(unitTime)
    expect("4/18/2021").toEqual(date)
  });

  it('should return only time', () => {
    const unitTime = 1618760226
    let time = component.getTime(unitTime)
    expect("9:07:06 PM").toEqual(time)
  });

  it('should return date time', () => {
    const unitTime = 1618760226
    let dateTime = component.getDateTime(unitTime)
    expect("4/18/2021, 9:07:06 PM").toEqual(dateTime)
  });

  it('should be able to seach the weather details by cityname', () => {

    if(component.isLoggedIn()){
      const compiled = fixture.nativeElement;
      compiled.querySelector('#search').innerHtml = "pune"
    }else{
      console.log('User not logged in yet')
    }
   
    
  });

});
