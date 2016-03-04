import {Component, AfterViewInit, ElementRef, Inject, provide} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';

import {InforService} from './infor.service';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
var globalService;

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
export class SigninComponent implements AfterViewInit {
    //private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U'   
    constructor(
        inforService: InforService,
        http: Http,
        private router: Router,
        elementRef: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.element = elementRef.nativeElement.children[0];
        this.signedIn = false; // todo -> auth factory
        if (localStorage.getItem('myInfo')) {
            this.localData = JSON.parse(localStorage.getItem('myInfo'));
            if (this.localData) {
                this.setglink(this.localData.googleUrl);
                this.setgimage(this.localData.imageUrl);
            }
        }
    }

    ngAfterViewInit() {
        globalService = this.inforService;
        gapi.signin2.render(this.element, {
            width: 240,
            longtitle: true,
            onsuccess: (googleUser) => {
                this.signedIn = true;
                this.onSuccess(googleUser);
                $('.modal-trigger').leanModal(); // show modal
            },
            onfailure: (error) => {
                console.log(error);
            },
            scope: 'profile email',
            redirect_uri: 'http://localhost:3000' //todo
        });

        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.then(function() {
                if (!auth2.isSignedIn.get()) {
                    globalService.setInforUser(null);
                   // window.location.reload();
                }
            });
        });
    }

    getSignIn() {
        return this.signedIn;
    }
    getglink() {
        return this.glink;
    }
    setglink(link) {
        this.glink = link;
    }
    setgimage(image) {
        this.gimage = image;
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
                this.setglink(dataInput.googleUrl);
                this.setgimage(dataInput.imageUrl);
                if (typeof this.inforService.getInforUser() == 'undefined' || this.inforService.getInforUser() == null) {
                    this.inforService.setInforUser(dataInput);
                    window.location.replace(window.location.href);
                } else {
                    this.inforService.setInforUser(dataInput);
                }
            });
    }
}
