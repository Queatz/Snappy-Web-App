import { Component, OnInit, ElementRef, provide, AfterViewInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router, OnActivate } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { OffersComponent } from './offers.component';
import { ParseLinksComponent } from './parseLinks.component';
import { FloatingComponent } from './floating.component';
import { NewOfferModal } from './new-offer.modal';
import { ApiService } from './api.service';

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
    public notFound = false;
    private offers;
    private myProfile;

    constructor(
        inforService: InforService,
        private api: ApiService,
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

        this.newOfferModal = NewOfferModal;
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
        setTimeout(this.ngAfterViewInit.bind(this), 500);
    }

    loadPerson(personName) {
            this.api.getPersonByName(personName)
            .subscribe(person => {
                this.person = person;
                this.inforService.setPageTitle(person.firstName);
                this.loaded(person.offers);
            },
            error => this.notFound = true);
    }

    ngAfterViewInit() {
        if (this.inforService.triggerProfile && this.isMyProfile()) {
            this.inforService.triggerProfile = false;
            $(this.element).find('.modal-trigger-floating').leanModal();
       }

       $(this.element).find('ul.tabs').tabs();
    }

    isMyProfile() {
        return this.inforService.getInforUser() !== undefined
                && this.myProfile == this.inforService.getInforUser().googleUrl;
    }

    routerOnActivate() {
        this.inforService.setPageTitle('Village');
    }
}
