import { Component, AfterViewInit, ElementRef, NgZone } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { SetPhotoModal } from './set-photo.modal';
import { EditDetailsModal } from './edit-details.modal';

@Component({
    templateUrl: 'app/project.component.html',
    styleUrls: ['app/project.component.css'],
    directives: [ROUTER_DIRECTIVES, SetPhotoModal, EditDetailsModal]
})
export class ProjectComponent implements AfterViewInit {
    public thing;
    public notFound = false;

    constructor(private ngZone: NgZone, private api: ApiService, private inforService: InforService, private routeParams: RouteParams, elementRef: ElementRef) {
        this.id = this.routeParams.get('id');
        this.element = elementRef.nativeElement;

        api.earthThing(this.id).subscribe(thing => {
                    this.thing = thing;
                    setTimeout(this.ngAfterViewInit.bind(this), 500);
                },
                error => this.notFound = true);
    }

    ngAfterViewInit() {
        $(this.element).find('.modal-trigger').leanModal();
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
}
