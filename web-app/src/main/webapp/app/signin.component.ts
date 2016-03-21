import {Component, AfterViewInit, ElementRef, Inject, OnInit, provide, NgZone} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';

import {InforService} from './infor.service';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}

@Component({
    selector: 'signin',
    templateUrl: 'app/signin.component.html',
    styleUrls: ['app/signin.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, { useClass: MyOptions })],
    directives: [ROUTER_DIRECTIVES]
})
export class SigninComponent implements AfterViewInit, OnInit {
    public signedIn: boolean;
    private element;

    constructor(
        inforService: InforService,
        http: Http,
        private _ngZone: NgZone,
        private router: Router,
        elementRef: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.element = elementRef.nativeElement;
        this.signedIn = false; // todo -> auth factory
        if (localStorage.getItem('myInfo')) {
            this.localData = JSON.parse(localStorage.getItem('myInfo'));
            if (this.localData) {
                this.glink = this.localData.googleUrl;
                this.gimage = this.localData.imageUrl;
            }
        }
    }

    ngOnInit() {

    }
    ngAfterViewInit() {
        var inforService = this.inforService;
        gapi.signin2.render(this.element.querySelector('.google-signin'), {
            width: 120,
            longtitle: false,
            onsuccess: (googleUser) => {
                this.signedIn = true;
                this.onSuccess(googleUser);
            },
            onfailure: (error) => {
                console.log(error);
            },
            scope: 'profile email',
            redirect_uri: 'postmessage'
        });

        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.getAuthInstance();
            if (auth2) {
                auth2.then(function() {
                    if (!auth2.isSignedIn.get()) {
                        inforService.setInforUser(null);
                    }
                });
            }
        });
    }

    /**
     * save user info if get googleuser success
     */
    public onSuccess(googleUser) {
        var gemail = googleUser.getBasicProfile().getEmail();
        var gtoken = googleUser.getAuthResponse().access_token;

        this.http.get('http://queatz-snappy.appspot.com/api/me' + '?email=' + gemail + '&auth=' + gtoken)
            .map((res: Response) => res.json())
            .subscribe(dataInput => {

                if (!this.inforService.getInforUser()) {
                    this.inforService.setInforUser(dataInput);
                    this._ngZone.run(() => {
                        this.glink = dataInput.googleUrl;
                        this.gimage = dataInput.imageUrl;                        
                    });
                } else {
                    this.inforService.setInforUser(dataInput);
                }
            });
    }
}
