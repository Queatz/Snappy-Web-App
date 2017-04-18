declare var $;
declare var _;
declare var Waves;
declare var Materialize;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'add-thing-modal',
    templateUrl: 'app/add-thing.modal.html',
    styleUrls: ['app/add-thing.modal.css'],
})
export class AddThingModal implements AfterViewInit {
    @Input() thing;
    @Input() resizeCallback;
    public text: string;
    public results;
    private newThing;
    public newThingName;
    public searching;
    private position;

    private element;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.results = [];
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
        this.search();
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
            Materialize.toast((member.source.name || member.source.firstName || member.source.about) + ' added', 4000);
        });
    }

    search() {
        this.searching = true;
        if (!this.position) {
            navigator.geolocation.getCurrentPosition(this.doSearch.bind(this));
        } else {
            this.doSearch(this.position);
        }
    }

    select(index) {
        this.results = [this.results[index]];

        if (this.results.length) {
            this.newThingName = this.results[0].name || this.results[0].firstName || this.results[0].about;
        } else {
            this.newThingName = undefined;
        }
    }

    private doSearch(position) {
        this.position = position;
        this.api.earthSearch(position.coords, this.text || '', 'person|resource|project|offer|club|hub').subscribe(results => {
            this.results = results;
            this.searching = false;

            if (results.length) {
                this.newThingName = results[0].name || results[0].firstName || results[0].about;
            } else {
                this.newThingName = undefined;
            }
        });
    }

    url(thing: any) {
        if (thing.kind === 'person') {
            return thing.imageUrl;
        }

        if (thing.photo) {
            return this.api.earthImageUrl(thing.id, 64);
        }
    }
}
