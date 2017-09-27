declare var Materialize: any;
declare var $: any;
declare var _: any;

import { Component, Input, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public typeClass;
    @Input() public deleteCallback;
    @Input() public thing;

    public isSameKind: any;

    constructor(
        private api: ApiService,
        private router: Router,
        private inforService: InforService,
        private elementRef: ElementRef
    ) {
        this.isSameKind = this.isSameKindBounded.bind(this);
    }

    ngOnInit() {
        if (this.thing.kind === 'member') {
            if (this.thing.source) {
                this.thing.source.member = this.thing;
                this.thing = this.thing.source;
            }
        }

        this.typeClass = util.typeClassOf(this.thing.kind);

        switch (this.thing.kind) {
            case 'person':
                this.thing.name = this.thing.firstName + ' ' + this.thing.lastName;
        }
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }

    public removable() {
        return this.thing.member && this.thing.member.target.owner;
    }

    public remove() {
        if (this.thing.member) {
            this.api.earthDelete(this.thing.member.id)
                .map(res => {
                    if (res.status == 200) {
                        Materialize.toast('Removed ' + this.thing.name, 4000);

                        if (this.deleteCallback) {
                            this.deleteCallback(this.thing);
                        }
                    } else {
                        Materialize.toast('Remove failed', 4000);
                    }
                })
                .subscribe();

            return;
        }
    }

    public editRole() {
        $(this.elementRef.nativeElement.querySelector('#editRoleModal')).modal('open');
    }

    public isSameKindBounded(thing: any) {
        return thing && thing.target && thing.target.kind === this.thing.kind;
    }

    public presence() {
        return util.presence(this.thing);
    }

    public getPhotoUrl() {
        return this.getPhotoUrlFor(this.thing, 480);
    }

    public getPhotoUrlFor(thing: any, sz: number) {
        if (!thing) {
            return 'img/night.png';
        }

        switch (thing.kind) {
            case 'person':
                return thing.imageUrl.split('=')[0] + '=' + sz;
            default:
                if (thing.photo) {
                    return this.api.earthPhotoUrlForSize(thing.id, sz);
                } else {
                    return 'img/night.png';
                }
        }
    }

    public go() {
        if (!this.thing) {
            return;
        }

        this.router.navigate(util.thingUrl(this.thing));
    }

    public goUrl() {
        if (!this.thing) {
            return;
        }

        return util.thingUrl(this.thing);
    }

    public goUrlFor(thing: any) {
        if (!thing) {
            return;
        }

        return util.thingUrl(thing);
    }

    public goText() {
        if (!this.thing) {
            return;
        }

        switch (this.thing.kind) {
            case 'project': return 'View Project';
            case 'resource': return 'View Resource';
            case 'hub': return 'Go To Hub';
            case 'club': return 'Go to Club';
            case 'form': return 'View Form';
            case 'person': return 'Visit ' + this.thing.firstName;
        }
    }
}
