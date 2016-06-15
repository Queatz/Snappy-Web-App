import { Component, AfterViewInit, ElementRef, NgZone } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { SetPhotoModal } from './set-photo.modal';
import { EditDetailsModal } from './edit-details.modal';
import { PostUpdateModal } from './post-update.modal';
import { PersonLinkComponent } from './person-link.component';
import { ThingUpdatesComponent } from './thing-updates.component';

@Component({
    templateUrl: 'app/project.component.html',
    styleUrls: ['app/project.component.css'],
    directives: [ROUTER_DIRECTIVES, SetPhotoModal, EditDetailsModal, PersonLinkComponent, PostUpdateModal, ThingUpdatesComponent]
})
export class ProjectComponent implements AfterViewInit {
    public thing;
    public notFound = false;

    constructor(private ngZone: NgZone, private api: ApiService, private inforService: InforService, private routeParams: RouteParams, elementRef: ElementRef) {
        this.id = this.routeParams.get('id');
        this.element = elementRef.nativeElement;

        api.earthThing(this.id).subscribe(thing => {
                    this.thing = thing;
                    this.thing.updates = _.sortBy(this.thing.updates, update => -moment(update.date));
                    this.inforService.setPageTitle(this.thing.name);
                    setTimeout(this.ngAfterViewInit.bind(this), 500);
                },
                error => this.notFound = true);
    }

    ngAfterViewInit() {
        $(this.element).find('.modal-trigger').leanModal();
        $('.tooltipped').tooltip({delay: 50});
    }

    public isMine() {
        return this.thing && this.inforService.getInforUser()
                && this.thing.contactId === this.inforService.getInforUser().id;
    }

    public getUrl() {
        if (this.thing && this.thing.photo) {
            return this.api.earthPhotoUrl(this.thing.id);
        }
    }

    public canEdit() {
        if (!this.inforService.getInforUser()) {
            return false;
        }

        var me = this.inforService.getInforUser().id;

        return this.thing && _.some(this.thing.contacts, t => t.target.id === me);
    }

    public addressLink() {
        return 'https://www.google.com/maps/place/' + this.thing.address + '/@' + this.thing.geo.latitude + ',' + this.thing.geo.longitude + ',15z'
    }

    routerOnActivate() {
        this.inforService.setPageTitle('Village');
    }
}
