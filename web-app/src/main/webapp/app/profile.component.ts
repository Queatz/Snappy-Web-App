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
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable, Subject, Subscription } from 'rxjs';
import { WorldService } from './world.service';


@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy, WebTitleProvider {
    public notFound = false;
    private myProfile;
    public editAbout;
    public editLink;
    public editLinkPrecheck;
    public showLink;

    private editLinkPrecheckSubscription: Subscription;
    private element;
    public thing;
    private newOfferModal;
    private newResourceModal;
    private newProjectModal;
    private newHubModal;
    private postUpdateModal;
    private tab;
    private preselect: string = null;
    private pageTitle: Subject<string>;
    private on: Subscription;

    constructor(
        private inforService: InforService,
        private world: WorldService,
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        element: ElementRef
    ) {
        this.element = element.nativeElement;
        this.thing = null;

        this.newOfferModal = NewOfferModal;
        this.newResourceModal = NewResourceModal;
        this.newProjectModal = NewProjectModal;
        this.newHubModal = NewHubModal;
        this.postUpdateModal = PostUpdateModal;
    }

    ngOnInit() {
        this.route.params.subscribe(this.subFunc.bind(this));
        this.on = this.world.on(e => {
            if (this.thing) {
                this.loadPerson(this.thing.googleUrl);
            }
        });
    }

    subFunc(params: any) {
        let id = params['id'];
        let tab = params['tab'];

        let self = this;

        this.preselect = tab;
        this.loadPerson(id);
        this.myProfile = id;
    }

    loaded(offers) {
        setTimeout(this.ngAfterViewInit.bind(this), 500);
    }

    loadPerson(personName) {
        this.thing = null;

        this.api.getPersonByName(personName, 'firstName,lastName,imageUrl,googleUrl,infoDistance,around,backing,backers,backs(source(firstName,lastName,imageUrl,googleUrl)),photo,cover,about,members(role,source(date,name,photo,about,owner,going,want,liked,likers,likes(source(firstName,lastName,imageUrl,googleUrl)),joins(source(name,firstName,lastName,photo,imageUrl,googleUrl)),source(imageUrl,googleUrl,photo,firstName,lastName),clubs(name)),target(name,owner,imageUrl,googleUrl,photo,firstName,lastName,about)),clubs(name)')
        .subscribe(person => {
            this.thing = person;
            util.setBodyBackground(util.imageUrl(this.thing.imageUrl, 640));

            if (this.thing.members) {
                this.thing.people = _.filter(this.thing.members, m => m.source && m.source.kind === 'person');
                this.thing.offers = _.filter(this.thing.members, m => m.source && m.source.kind === 'offer');
                this.thing.resources = _.filter(this.thing.members, m => m.source && m.source.kind === 'resource');
                this.thing.hubs = _.filter(this.thing.members, m => m.source && m.source.kind === 'hub');
                this.thing.projects = _.filter(this.thing.members, m => m.source && m.source.kind === 'project');
                this.thing.clubMembers = _.filter(this.thing.members, m => m.source && m.source.kind === 'club');
                this.thing.contacts = _.filter(this.thing.members, m => m.source && m.source.kind === 'contact');
                this.thing.updates = _.filter(this.thing.members, m => m.source && m.source.kind === 'update');
                this.thing.forms = _.filter(this.thing.members, m => m.source && m.source.kind === 'form');
                this.thing.modes = _.filter(this.thing.members, m => m.source && m.source.kind === 'mode');

                this.thing.updates = _.sortBy(this.thing.updates, m => -moment(m.source && m.source.date));
                this.thing.offers = _.sortBy(this.thing.offers, 'price');
            }

            this.editAbout = person.about;
            this.editLink = person.googleUrl;
            this.pageTitle.next(person.firstName);
            this.loaded(person.offers);
        },
        error => this.notFound = true);
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element.querySelector('.modal')).modal();

        if (this.preselect) {
            let self = this;
            setTimeout(() => $(self.element).find('ul.tabs').tabs('select_tab', 'tab-' + this.preselect));
        }
    }

    ngOnDestroy() {
        this.on.unsubscribe();
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    saveEdit() {
        this.api.saveAbout(this.editAbout).subscribe(() => {
            this.thing.about = this.editAbout;
        });

        if (this.showLink) {
            this.api.saveMyLink(this.editLink).subscribe(response => {
                if (response.success) {
                    this.thing.googleUrl = this.editLink;
                    this.inforService.getInforUser().googleUrl = this.editLink;
                    this.inforService.setInforUser(this.inforService.getInforUser());
                }
            });
        }
    }

    onLinkChange() {
        if (this.editLinkPrecheckSubscription) {
            this.editLinkPrecheckSubscription.unsubscribe();
        }

        this.editLinkPrecheck = 'checking';
        this.editLinkPrecheckSubscription = this.api.saveMyLinkPrecheck(this.editLink).subscribe(response => {
            this.editLinkPrecheck = (response.success ? 'available' : 'unavailable');
        });
    }

    toggleBacking() {
        this.api.follow(this.thing.id, !this.thing.backing)
            .subscribe(thing => {
                switch (thing.kind) {
                    case 'person':
                        this.thing.backing = thing.backing;
                        this.thing.backers = thing.backers;
                        break;
                    case 'follower':
                        this.thing.backing = true;
                        this.thing.backers = thing.target.backers;
                }
            });
    }

    isMyProfile() {
        return this.inforService.getInforUser() !== undefined
                && this.myProfile == this.inforService.getInforUser().googleUrl;
    }

    toggleShowLink() {
        this.showLink = !this.showLink;
    }

    public getWebTitle() {
        this.pageTitle = new Subject<string>();
        return this.pageTitle;
    }

    public presence() {
        return util.presence(this.thing);
    }

    public getCoverUrl() {
        if (this.thing) {
            if (!this.thing.cover) {
                return 'url(/img/feature.jpg)';
            }

            return 'url(' + this.api.earthPhotoUrl(this.thing.cover.id) + ')';
        }

        return '';
    }
}
