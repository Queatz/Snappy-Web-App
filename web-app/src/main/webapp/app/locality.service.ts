declare var google;
declare var _;

import { Injectable } from '@angular/core';

@Injectable()
export class LocalityService {

    private callbacks = [];
    private position: any;

    constructor() { }

    public get(callback: any) {
        this.callbacks.push(callback);

        let lastKnownLocality = localStorage.getItem('lastKnownLocality');
        let lastKnownPosition = localStorage.getItem('lastKnownPosition');

        if (lastKnownPosition) {
            this.position = JSON.parse(lastKnownPosition);
        }

        if (lastKnownLocality) {
            callback(lastKnownLocality);
        }

        navigator.geolocation.getCurrentPosition(this.onLocationFound.bind(this));
    }

    private onLocationFound(position: any) {
        this.position = position;

        localStorage.setItem('lastKnownPosition', JSON.stringify({
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        }));

        new google.maps.Geocoder().geocode({
            location: new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            )
        }, (results: any) => {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];

                if ('address_components' in result) {
                    for (var j = 0; j < result['address_components'].length; j++) {
                        var component = result['address_components'][j];
                        if (_.includes(component.types, 'locality')) {
                            this.onLocalityFound(component.short_name);
                            break;
                        }
                    }
                }
            }
        });
    }

    public getPosition(): any {
        return this.position;
    }

    private onLocalityFound(locality: string) {
        localStorage.setItem('lastKnownLocality', locality);

        while (this.callbacks.length) {
            this.callbacks.pop()(locality);
        }
    }
}
