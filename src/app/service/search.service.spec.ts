import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxWebstorageModule.forRoot()
      ]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
