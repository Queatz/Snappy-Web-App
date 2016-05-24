import { Component, OnInit, ElementRef, AfterViewInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router, OnActivate } from 'angular2/router';
import { OffersComponent } from './offers.component';
import { ThingUpdatesComponent } from './thing-updates.component';
import { ParseLinksComponent } from './parseLinks.component';
import { FloatingComponent } from './floating.component';
import { NewOfferModal } from './new-offer.modal';
import { ApiService } from './api.service';
import { PostUpdateModal } from './post-update.modal';
import { InforService } from './infor.service';

@Component({
    templateUrl: 'app/profile.component.html',
    styleUrls: ['app/profile.component.css'],
    directives: [ROUTER_DIRECTIVES, OffersComponent, ParseLinksComponent, FloatingComponent, PostUpdateModal, ThingUpdatesComponent],
})
//@RouteConfig([
//  { path: '/',       component: OffersTabComponent, useAsDefault: true },
//  { path: '/updates', component: UpdatesTabComponent },
//])
export class ProfileComponent implements OnInit, AfterViewInit {
    public notFound = false;
    private offers;
    private myProfile;

    constructor(
        inforService: InforService,
        private api: ApiService,
        private router: Router,
        private routeParams: RouteParams,
        element: ElementRef
    ) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.offers = null;
        this.person = null;

        this.newOfferModal = NewOfferModal;
    }

    ngOnInit() {
        let id = this.routeParams.get('id');
        let tab = this.routeParams.get('tab');

        // XXX wat
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
