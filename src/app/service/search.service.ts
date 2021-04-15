import { Injectable } from '@angular/core';
import {SessionStorageService} from 'ngx-webstorage';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from '../urls';
import { RestResponse } from '../models/RestResponse';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, private sessionStore: SessionStorageService) { 
    const  token = this.sessionStore.retrieve('jwt-token');

  }

  
	getHTTPHeaders(): HttpHeaders {
		const  token  = this.sessionStore.retrieve('jwt-token');
		let result = new HttpHeaders();
		result = result.set('Content-Type', 'application/json');
		result = result.set('Authorization', 'Bearer ' +token);
		return result;
	}

  
	searchForWeatherConditionInCity(cityName:string):Observable<RestResponse>{
		const httpHeaders = this.getHTTPHeaders();
		return this.http.get<RestResponse>(Urls.BASE_URL+Urls.SEARCH+cityName,{   headers: httpHeaders,});

	}

}
