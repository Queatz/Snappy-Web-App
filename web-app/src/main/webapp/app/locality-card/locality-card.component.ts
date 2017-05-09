declare var google;
declare var Materialize;
declare var _;
declare var $;

import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

import util from '../util';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'locality-card',
  templateUrl: './locality-card.component.html',
  styleUrls: ['./locality-card.component.css']
})
export class LocalityCardComponent implements AfterViewInit, OnDestroy {
    public locality: string;
    private position: any;
    public subscribeEmail: string;

    constructor(private inforService: InforService, private api: ApiService, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        navigator.geolocation.getCurrentPosition(this.onLocationFound.bind(this));
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }
    private onLocationFound(position: any) {
        this.position = position;
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

    public subscribe() {
        if (!util.validateEmail(this.subscribeEmail)) {
            Materialize.toast('Enter an email address', 2000);
            return;
        }

        this.api.subscribeToLocality(this.position.coords, this.locality, this.subscribeEmail)
            .subscribe(json => {
                if (json.success) {
                    this.inforService.setSubscribedTo(this.locality, true);
                    Materialize.toast('Subscribed!', 4000);
                } else {
                    Materialize.toast('That didn\'t work...', 4000);
                }
            }, () => {
                    Materialize.toast('That didn\'t work...', 4000);
            });
    }

    public resubscribe() {
        this.inforService.setSubscribedTo(this.locality, false);
    }

    public isSubscribed() {
        return this.inforService.getSubscribedTo(this.locality);
    }

    public isAuthenticated() {
        return !!this.inforService.getInforUser();
    }
}
