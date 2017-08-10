declare var Materialize;
declare var $;

import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

import util from '../util';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';
import { LocalityService } from '../locality.service';

@Component({
  selector: 'locality-card',
  templateUrl: './locality-card.component.html',
  styleUrls: ['./locality-card.component.css']
})
export class LocalityCardComponent implements AfterViewInit, OnDestroy {
    public locality: string;
    public subscribeEmail: string;

    constructor(private inforService: InforService,
            private api: ApiService,
            private elementRef: ElementRef,
            private localityService: LocalityService) { }

    ngAfterViewInit() {
        this.localityService.get(this.onLocalityFound.bind(this));
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }

    private onLocalityFound(locality: string) {
        this.locality = locality;
    }

    public subscribe() {
        if (!util.validateEmail(this.subscribeEmail)) {
            Materialize.toast('Enter an email address', 2000);
            return;
        }

        this.api.subscribeToLocality(this.localityService.getPosition().coords, this.locality, this.subscribeEmail)
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
