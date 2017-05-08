declare var google;
declare var _;
declare var $;

import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'locality-card',
  templateUrl: './locality-card.component.html',
  styleUrls: ['./locality-card.component.css']
})
export class LocalityCardComponent implements AfterViewInit, OnDestroy {
    public locality: string;

    constructor(private elementRef: ElementRef) { }

    ngAfterViewInit() {
        navigator.geolocation.getCurrentPosition(this.onLocationFound.bind(this));
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
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
        this.locality = locality;
    }
}
