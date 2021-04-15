import { Injectable } from '@angular/core';
import {SessionStorageService} from 'ngx-webstorage';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../urls';
import { RestResponse } from '../models/RestResponse';

@Injectable({
  providedIn: 'root'
})
export class UserSearchHistoryService {

  constructor(private http: HttpClient, private sessionStore: SessionStorageService) { }


  getHTTPHeaders(): HttpHeaders {
		const  token  = this.sessionStore.retrieve('jwt-token');
		let result = new HttpHeaders();
		result = result.set('Content-Type', 'application/json');
		result = result.set('Authorization', 'Bearer ' +token);
		return result;
	}

  fetchUserSearchHistory(page:number,size:number):Observable<RestResponse>{
		const httpHeaders = this.getHTTPHeaders();
    const url = Urls.BASE_URL+Urls.USER_SEARCH_HISTORY+"page="+page+"&size="+size
		return this.http.get<RestResponse>(url,{   headers: httpHeaders,});

	}
}
