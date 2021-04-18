import { TestBed } from '@angular/core/testing';

import { SearchHistoryService } from './search-history.service';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchHistoryService', () => {
  let service: SearchHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxWebstorageModule.forRoot()
      ]
    });
    service = TestBed.inject(SearchHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
