declare var $;
declare var moment;
declare var _;

import { Component, OnInit, AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/project.component.html',
    styleUrls: ['app/project.component.css'],
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {
    public thing;
    public notFound = false;

    private id;
    private removingContact;
    private element;
    private isFollowing;

    constructor(private ngZone: NgZone, private api: ApiService, private inforService: InforService, private route: ActivatedRoute, elementRef: ElementRef) {
        route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.element = elementRef.nativeElement;

        api.earthThing(this.id).subscribe(thing => {
                    this.thing = thing;
                    this.thing.updates = _.sortBy(this.thing.updates, update => -moment(update.date));
                    this.inforService.setPageTitle(this.thing.name);
                    setTimeout(this.ngAfterViewInit.bind(this), 500);
                },
                error => this.notFound = true);
    }

    ngOnInit() {
        this.inforService.setPageTitle('Village');
    }

    ngAfterViewInit() {
        $(this.element).find('.modal-trigger').leanModal();
        $(this.element).find('.tooltipped').tooltip({delay: 50});
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
                $(this.element).find('#removeContactModal').openModal();
            });
        };
    }

    public isSignedIn() {
        return this.inforService.getInforUser();
    }

    public canEdit() {
        if (!this.inforService.getInforUser()) {
            return false;
        }

        var me = this.inforService.getInforUser().id;

        return this.thing && _.any(this.thing.contacts, t => t.target.id === me);
    }

    public addressLink() {
        return 'https://www.google.com/maps/place/' + this.thing.address + '/@' + this.thing.geo.latitude + ',' + this.thing.geo.longitude + ',15z'
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
}
