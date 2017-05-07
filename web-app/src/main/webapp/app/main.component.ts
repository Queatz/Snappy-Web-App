declare var $;
declare var google;
declare var _;

import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';
import { NewOfferModal } from './new-offer.modal';

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnDestroy {
    private inforService;
    private newOfferModal;
    public locality: string;

    constructor(inforService: InforService, private elementRef: ElementRef, public tutorial: TutorialService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
    }

    newUser() {
        return !this.inforService.getInforUser();
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Village');
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});

        navigator.geolocation.getCurrentPosition(this.onLocationFound.bind(this));
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
