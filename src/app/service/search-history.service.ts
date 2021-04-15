import { Injectable } from '@angular/core';
import {SessionStorageService} from 'ngx-webstorage';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../urls';
import { RestResponse } from '../models/RestResponse';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {

  constructor(private http: HttpClient, private sessionStore: SessionStorageService) { }

  
	getHTTPHeaders(): HttpHeaders {
		const  token  = this.sessionStore.retrieve('jwt-token');
		let result = new HttpHeaders();
		result = result.set('Content-Type', 'application/json');
		result = result.set('Authorization', 'Bearer ' +token);
		return result;
	}

  
	deleteSearchHistory(searchIds:number[]):Observable<RestResponse>{
		const httpHeaders = this.getHTTPHeaders();
    let deleteRequest = {
      "searchIds" : searchIds
    }
		return this.http.post<RestResponse>(Urls.BASE_URL+Urls.DELETE_USER_SEARCH_HISTORY,deleteRequest,{   headers: httpHeaders,});
	}

}
