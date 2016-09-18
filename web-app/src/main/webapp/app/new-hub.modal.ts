declare var $;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { MapComponent } from './map.component';

@Component({
    templateUrl: 'app/new-hub.modal.html',
    styleUrls: ['app/new-hub.modal.css'],
    directives: [MapComponent]
})
export class NewHubModal implements AfterViewInit {
    @Input() modalId;

    @ViewChild(MapComponent)
    private map: MapComponent;

    private element;
    private name
    private address;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.name = '';
        this.address = '';

        navigator.geolocation.getCurrentPosition((position) => {
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
        $(this.element.querySelector('#hubVisibility')).material_select();
    }

    newHub() {
        if (!this.name || !this.address) {
            return;
        }

        this.api.earthCreate({
            kind: 'hub',
            name: this.name,
            address: this.address,
            latitude: this.map.getMarkerPosition().lat(),
            longitude: this.map.getMarkerPosition().lng()
        }).subscribe(hub => {
            $(this.element.querySelector('#modal')).closeModal();
            this.router.navigate(['/hubs/' + hub.id]);
        });
    }
}
