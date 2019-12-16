declare var google;
declare var _: any;

import { Injectable } from '@angular/core';
import { InforService } from './infor.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LocalityService {
    private callbacks = [];
    private position: any;
    private localityObservable = new BehaviorSubject<string>('');

    constructor(private inforService: InforService) { }

    public get(callback: any) {
        this.callbacks.push(callback);

        let lastKnownLocality = localStorage.getItem('lastKnownLocality');

        if (lastKnownLocality) {
            callback(lastKnownLocality);
        }

        this.inforService.getLocation(this.onLocationFound.bind(this));
    }

    public observe() {
        this.inforService.getLocation(this.onLocationFound.bind(this));

        return this.localityObservable;
    }


    private onLocationFound(position: any) {
        this.position = position;

        if (!google) {
            setTimeout(() => this.onLocalityFound(position), 1000);
            return;
        }

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

        this.localityObservable.next(locality);
    }
}
