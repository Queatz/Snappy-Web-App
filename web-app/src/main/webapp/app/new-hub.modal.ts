declare var $: any;
declare var Waves: any;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

import { MapComponent } from './map.component';

@Component({
    selector: 'new-hub-modal',
    templateUrl: './new-hub.modal.html',
    styleUrls: ['./new-hub.modal.css'],
})
export class NewHubModal implements AfterViewInit {
    @Input() modalId;
    @Input() asMemberOf;

    @ViewChild(MapComponent, { static: false })
    private map: MapComponent;

    private element;
    public name
    public address;
    public thing;

    public isPublic: any;
    public clubs: any;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.name = '';
        this.address = '';
        this.isPublic = true;
        this.clubs = {};

        this.inforService.getLocation((position) => {
            this.thing = {
                geo: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            };
        });
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('#hubVisibility')).formSelect();
        $(this.element.querySelector('.modal')).modal();
    }

    newHub() {
        if (!this.name) {
            return;
        }

        this.api.earthCreate({
            kind: 'hub',
            name: this.name,
            address: this.address,
            latitude: this.map.getMarkerPosition().lat(),
            longitude: this.map.getMarkerPosition().lng(),
            hidden: !this.isPublic,
            clubs: JSON.stringify(this.clubs),
            'in': this.asMemberOf ? this.asMemberOf.id : undefined
        }).subscribe(hub => {
            $(this.element.querySelector('.modal')).modal('close');
            this.router.navigate(['/hubs/' + hub.id]);
        });
    }
}
