import { Component, OnInit, ElementRef, provide, AfterViewInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { OffersComponent } from './offers.component';
import { ParseLinksComponent } from './parseLinks.component';
import { FloatingComponent } from './floating.component';

import {InforService} from './infor.service';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}

@Component({
    templateUrl: 'app/profile.component.html',
    styleUrls: ['app/profile.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, { useClass: MyOptions })],
    directives: [ROUTER_DIRECTIVES, OffersComponent, ParseLinksComponent, FloatingComponent],

})
export class ProfileComponent implements OnInit, AfterViewInit {
    private offers;
    private myProfile;
    private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
    constructor(
        inforService: InforService,
        private router: Router,
        private routeParams: RouteParams,
        http: Http,
        element: ElementRef
    ) {
        this.inforService = inforService;
        this.http = http;
        this.element = element.nativeElement;
        this.offers = null;
        this.person = null;
    }

    ngOnInit() {
        let id = this.routeParams.get('id');
        if (id !== 'messages') {
            this.loadPerson(id);
            this.myProfile = id;
        } else {
            this.router.navigate(['Messages', { id: '' }]);
        }
    }

    loaded(offers) {
        this.offers = offers;
    }

    loadPerson(personId) {
        if (typeof this.inforService.getInforUser() !== 'undefined' && typeof this.inforService.getInforUser().auth !== 'undefined') {
            this.token = this.inforService.getInforUser().auth;
        }
        this.http.get('http://queatz-snappy.appspot.com/api/people/by-name/' + personId + '?auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(person => {
                this.person = person;
                this.loaded(person.offers);
            });
    }
    ngAfterViewInit() {
        if (this.inforService.getModalTrigger() && this.isMyProfile()) {
            $('.modal-trigger-floating').leanModal();
        }
    }

    isMyProfile() {
        if (typeof this.inforService.getInforUser() !== 'undefined' && this.myProfile == this.inforService.getInforUser().googleUrl) {
            return true;
        }
        return false;
    }
}
