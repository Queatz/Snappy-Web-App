declare var $: any;
declare var _: any;
declare var Waves;
declare var M: any;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'add-thing-modal',
    templateUrl: './add-thing.modal.html',
    styleUrls: ['./add-thing.modal.css'],
})
export class AddThingModal implements AfterViewInit {
    @Input() thing;
    @Input() resizeCallback;
    public results;
    private newThing;
    public newThingName;

    private element;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.results = [];
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
    }

    onSearchResults(results: any) {
        this.results = results;

        if (this.results.length) {
            this.newThingName = this.results[0].name || this.results[0].firstName || this.results[0].about;
        } else {
            this.newThingName = undefined;
        }
    }

    add() {
        if (!this.results.length) {
            return;
        }

        let newThing = this.results[0];

        this.api.earthCreate({
            kind: 'member',
            source: newThing.id,
            target: this.thing.id
        }).subscribe(member => {
            var k: string;

            switch (newThing.kind) {
                case 'person':
                    k = 'people';
                    break;
                case 'club':
                    k = 'clubMembers';
                    break;
                default:
                    k = newThing.kind + 's';
            }

            if (!this.thing[k]) {
                this.thing[k] = [];
            }

            this.thing[k].push(member);

            if (this.resizeCallback) {
                this.resizeCallback();
            }

            $(this.element.querySelector('.modal')).modal('close');
            M.toast({ html: (member.source.name || member.source.firstName || member.source.about) + ' added' });
        });
    }
}
