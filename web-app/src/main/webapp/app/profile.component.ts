declare var $;
declare var _;
declare var moment;

import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewOfferModal } from './new-offer.modal';
import { NewProjectModal } from './new-project.modal';
import { NewResourceModal } from './new-resource.modal';
import { NewHubModal } from './new-hub.modal';
import { PostUpdateModal } from './post-update.modal';
import { ApiService } from './api.service';
import { InforService } from './infor.service';

@Component({
    templateUrl: 'app/profile.component.html',
    styleUrls: ['app/profile.component.css'],
})
//@RouteConfig([
//  { path: '/',       component: OffersTabComponent, useAsDefault: true },
//  { path: '/updates', component: UpdatesTabComponent },
//])
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    public notFound = false;
    private myProfile;
    public editAbout;

    private inforService: InforService;
    private element;
    private thing;
    private newOfferModal;
    private newResourceModal;
    private newProjectModal;
    private newHubModal;
    private postUpdateModal;
    private tab;
    private isFollowing;

    constructor(
        inforService: InforService,
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        element: ElementRef
    ) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.thing = null;

        this.newOfferModal = NewOfferModal;
        this.newResourceModal = NewResourceModal;
        this.newProjectModal = NewProjectModal;
        this.newHubModal = NewHubModal;
        this.postUpdateModal = PostUpdateModal;
    }

    ngOnInit() {
         this.inforService.setPageTitle('Village');

         this.route.params.subscribe(params => {
            let id = params['id'];
            let tab = params['tab'];

            this.loadPerson(id);
            this.myProfile = id;
        });
    }

    loaded(offers) {
        setTimeout(this.ngAfterViewInit.bind(this), 500);
    }

    loadPerson(personName) {
            this.api.getPersonByName(personName)
            .subscribe(person => {
                this.thing = person;

                if (this.thing.members) {
                    this.thing.people = _.filter(this.thing.members, m => m.source && m.source.kind === 'person');
                    this.thing.offers = _.filter(this.thing.members, m => m.source && m.source.kind === 'offer');
                    this.thing.resources = _.filter(this.thing.members, m => m.source && m.source.kind === 'resource');
                    this.thing.hubs = _.filter(this.thing.members, m => m.source && m.source.kind === 'hub');
                    this.thing.projects = _.filter(this.thing.members, m => m.source && m.source.kind === 'project');
                    this.thing.clubs = _.filter(this.thing.members, m => m.source && m.source.kind === 'club');
                    this.thing.contacts = _.filter(this.thing.members, m => m.source && m.source.kind === 'contact');
                    this.thing.updates = _.filter(this.thing.members, m => m.source && m.source.kind === 'update');
                    this.thing.updates = _.sortBy(this.thing.updates, m => -moment(m.source && m.source.date));
                }

                this.editAbout = person.about;
                this.inforService.setPageTitle(person.firstName);
                this.loaded(person.offers);
            },
            error => this.notFound = true);
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element.querySelector('.modal')).modal();

        if (this.inforService.triggerProfile && this.isMyProfile()) {
            this.inforService.triggerProfile = false;
       }
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    saveEdit() {
        this.api.saveAbout(this.editAbout).subscribe(() => {
            this.thing.about = this.editAbout;
        });
    }

    toggleFollow() {
        if (this.isFollowing) {
            // Show unfollow modal ->
            this.isFollowing = false;
        } else {
            // Follow -> this.isFollowing => true
            this.isFollowing = true;
        }
    }

    isMyProfile() {
        return this.inforService.getInforUser() !== undefined
                && this.myProfile == this.inforService.getInforUser().googleUrl;
    }
}
