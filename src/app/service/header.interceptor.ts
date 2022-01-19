import {Injectable } from '@angular/core';
import {SessionStorageService} from 'ngx-webstorage';
import { HttpInterceptor, HttpEvent, HttpClient, HttpRequest, HttpResponse, HttpHandler, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs'


@Injectable()
export class HeaderInterceptor implements HttpInterceptor{

    constructor(private sessionStore: SessionStorageService){

    }


    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        httpRequest = httpRequest.clone({
            setHeaders: {
              Authorization: `Bearer ${this.sessionStore.retrieve('jwt-token')}`,
              'Content-Type': 'application/json'
            }
          });
    return next.handle(httpRequest);
    }
    
    getHTTPHeaders(): HttpHeaders {
		const  token  = this.sessionStore.retrieve('jwt-token');
		let result = new HttpHeaders();
		result = result.set('Content-Type', 'application/json');
		result = result.set('Authorization', 'Bearer ' +token);
		return result;
	}
}


