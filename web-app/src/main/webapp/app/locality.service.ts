declare var google;
declare var _;

import { Injectable } from '@angular/core';

@Injectable()
export class LocalityService {

    private callbacks = [];

    constructor() { }

    public get(callback: any) {
        this.callbacks.push(callback);

        let lastKnownLocality = localStorage.getItem('lastKnownLocality');
        if (lastKnownLocality) {
            callback(lastKnownLocality);
        }

        navigator.geolocation.getCurrentPosition(this.onLocationFound.bind(this));
    }

    private onLocationFound(position: any) {
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

    private onLocalityFound(locality: string) {
        localStorage.setItem('lastKnownLocality', locality);

        while (this.callbacks.length) {
            this.callbacks.pop()(locality);
        }
    }
}
