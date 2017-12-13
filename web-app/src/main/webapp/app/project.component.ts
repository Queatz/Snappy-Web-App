declare var $;
declare var moment;
declare var _;

import { Component, OnInit, AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';
import { WebTitleProvider } from './extra';
import { Observable, Subject } from 'rxjs';

@Component({
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy, WebTitleProvider {
    public thing;
    public notFound = false;

    private id;
    private element;
    private selectedTab;
    public removingContact;
    public actionButtonInfoText;

    private pageTitle: Subject<string>;

    constructor(private ngZone: NgZone,
            private api: ApiService,
            private inforService: InforService,
            private route: ActivatedRoute,
            elementRef: ElementRef) {
        route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.element = elementRef.nativeElement;

        api.earthThing(this.id, 'name,photo,about,address,hidden,geo,infoDistance,members(role,source(message,token,data,type,role,date,firstName,hidden,lastName,googleUrl,imageUrl,name,photo,going,want,liked,likers,likes(source(firstName,lastName,imageUrl,googleUrl)),about,in(target(name,photo,firstName,lastName,imageUrl,googleUrl)),target(firstName,lastName,googleUrl,imageUrl,around,infoDistance),source(imageUrl,googleUrl,firstName,lastName),clubs(name)),target(name,owner,imageUrl,googleUrl,photo,firstName,lastName,about)),clubs(name)').subscribe(thing => {
                    this.thing = thing;

                    if (this.thing.photo) {
                        util.setBodyBackground(this.getUrl());
                    }

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
                        this.thing.actions = _.filter(this.thing.members, m => m.source && m.source.kind === 'action');
                        this.thing.goals = _.filter(this.thing.members, m => m.source && m.source.kind === 'goal');
                        this.thing.updates = _.sortBy(this.thing.updates, m => -moment(m.source && m.source.date));
                    }

                    this.pageTitle.next(this.thing.name);
                    setTimeout(this.ngAfterViewInit.bind(this), 500);
                },
                error => this.notFound = true);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element).find('ul.tabs').tabs();
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    public getUrl() {
        if (this.thing && this.thing.photo) {
            return this.api.earthPhotoUrl(this.thing.id);
        }
    }

    public removeCallbackFor(contact) {
        return event => {
            event.stopPropagation();
            event.preventDefault();
            this.removingContact = contact;
            setTimeout(() => {
                $(this.element).find('#removeContactModal').modal('open');
            });
        };
    }

    public removeCallbackForLink(contact) {
        return event => {
            event.stopPropagation();
            event.preventDefault();
            this.removingContact = contact;
            setTimeout(() => {
                $(this.element).find('#removeContactModal').modal('open');
            });
        };
    }

    selectTab(tab: string) {
        this.selectedTab = tab;
    }

    public isSignedIn() {
        return this.inforService.getInforUser();
    }

    public canEdit() {
        if (!this.inforService.getInforUser()) {
            return false;
        }

        if (this.thing && this.thing.owner) {
            return true;
        }

        var me = this.inforService.getInforUser().id;

        return this.thing && _.any(this.thing.contacts, t => t.source.target.id === me);
    }

    public addressLink() {
        return 'https://www.google.com/maps/place/' + this.thing.address + '/@' + this.thing.geo.latitude + ',' + this.thing.geo.longitude + ',15z'
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

    typeClassOf() {
         return util.typeClassOf(this.thing.kind);
    }

    actionBar() {
        this.thing.kind !== 'club';
    }

    actionButton() {
        switch (this.thing.kind) {
            case 'resource':
                return 'Use it';
            case 'project':
                return 'Join the project';
            case 'hub':
                return 'Get directions';
            case 'club':
                return 'Create Invite';
            case 'form':
                return 'Fill out form';
            case 'person':
            default:
                return '???';
        }
    }

    clickActionButton() {
        switch (this.thing.kind) {
            case 'resource':
                this.actionButtonInfoText = 'Talk with one of the contacts to use this resource.';
                $(this.element).find('info-modal').find('.modal').modal('open');
                break;
            case 'project':
                this.actionButtonInfoText = 'Talk with one of the contacts to join this project.';
                $(this.element).find('info-modal').find('.modal').modal('open');
                break;
            case 'hub':
                window.open(this.addressLink(), '_blank');
                break;
            case 'club':
                return 'Beg for membership';
            case 'form':
                window.open('/forms/' + this.id + '/submit', '_blank');
                break;
            case 'person':
            default:
                return '???';
        }
    }

    actionButtonEnabled() {
        switch (this.thing.kind) {
            case 'resource':
            case 'project':
                return this.thing && this.thing.contacts && this.thing.contacts.length;
            case 'hub':
            case 'club':
            case 'form':
            case 'person':
            default:
                return true;
        }
    }

    public getWebTitle() {
        this.pageTitle = new Subject<string>();
        return this.pageTitle;
    }

    public presence() {
        return util.presence(this.thing);
    }
}
