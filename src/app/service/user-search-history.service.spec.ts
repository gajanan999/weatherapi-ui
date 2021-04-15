import { TestBed } from '@angular/core/testing';

import { UserSearchHistoryService } from './user-search-history.service';

describe('UserSearchHistoryService', () => {
  let service: UserSearchHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSearchHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
