declare var M: any;
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
    @Input() public deleteCallback;
    @Input() public thing;

    public typeClass: string;

    constructor(
        private api: ApiService,
        private router: Router,
        private inforService: InforService,
        private elementRef: ElementRef
    ) { }

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
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('close');
    }

    public removable() {
        return this.thing.member && this.thing.member.target.owner;
    }

    public remove() {
        if (this.thing.member) {
            this.api.earthDelete(this.thing.member.id)
                .subscribe(res => {
                    if (res.status == 200) {
                        M.toast({ html: 'Removed ' + this.thing.name });

                        if (this.deleteCallback) {
                            this.deleteCallback(this.thing);
                        }
                    } else {
                        M.toast({ html: 'Remove failed' });
                    }
                });

            return;
        }
    }

    public editRole() {
        $(this.elementRef.nativeElement.querySelector('#editRoleModal')).modal('open');
    }

    public numberOfSameKindMembers() {
        if (!this.thing || !this.thing.members) {
            return;
        }
        return this.thing.members.reduce((i, member) => i + (member.source && member.source.kind === this.thing.kind ? 1 : 0), 0);
    }

    public presence() {
        return util.presence(this.thing);
    }

    public getPhotoUrl() {
        return this.api.getPhotoUrlFor(this.thing, 480);
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
