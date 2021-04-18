import { TestBed } from '@angular/core/testing';

import { UserSearchHistoryService } from './user-search-history.service';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserSearchHistoryService', () => {
  let service: UserSearchHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxWebstorageModule.forRoot()
      ]
    });
    service = TestBed.inject(UserSearchHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
