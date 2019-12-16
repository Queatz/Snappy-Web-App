import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private api: ApiService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.api.token();
        if (token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: token
                }
            });
        }

        return next.handle(request);
    }
}