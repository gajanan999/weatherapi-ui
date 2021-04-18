import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';



describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    let store:any = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(sessionStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
  spyOn(sessionStorage, 'setItem')
    .and.callFake(mockLocalStorage.setItem);
  spyOn(sessionStorage, 'removeItem')
    .and.callFake(mockLocalStorage.removeItem);
  spyOn(sessionStorage, 'clear')
    .and.callFake(mockLocalStorage.clear);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxWebstorageModule.forRoot()
      ]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
