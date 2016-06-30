import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'map',
    templateUrl: 'app/map.component.html',
    styleUrls: ['app/map.component.css']
})
export class MapComponent implements AfterViewInit {
    @Input() thing;

    constructor(element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        var geo = {lat: this.thing.geo.latitude, lng: this.thing.geo.longitude};

        this.map = new google.maps.Map(this.element.firstChild, {
            center: geo,
            zoom: 17
        });

        var cancel = setInterval(() => {
            if (!$(this.element.firstChild).is(':visible')) {
                return;
            }

            clearInterval(cancel);

            google.maps.event.trigger(this.map, 'resize');

            this.map.setCenter(this.marker.getPosition());
        }, 200);

        this.mark(geo);
    }

    public updateAddress(address: string) {
        if (!address) {
            return;
        }

        new google.maps.Geocoder().geocode({
            address: address,
            bounds: this.map.getBounds()
        }, (results) => {
            if (results && results.length) {
                this.centerMap({ coords: {
                    latitude: results[0].geometry.location.lat(),
                    longitude: results[0].geometry.location.lng()
                }});

                google.maps.event.trigger(this.map, 'resize');
            }
        });
    }

    public getMarkerPosition() {
        return this.marker.getPosition();
    }

    centerMap(position) {
        var geo = {lat: position.coords.latitude, lng: position.coords.longitude};

        this.map.setCenter(geo);
        this.mark(geo);
    }

    mark(geo) {
        if (!this.marker) {
            this.marker = new google.maps.Marker({
                position: geo,
                map: this.map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                title: this.thing.name
            });
        } else {
            this.marker.setPosition(geo);
        }
    }
}