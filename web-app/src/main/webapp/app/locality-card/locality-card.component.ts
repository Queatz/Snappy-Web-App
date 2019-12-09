declare var M: any;
declare var $: any;

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
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('close');
    }

    private onLocalityFound(locality: string) {
        this.locality = locality;
    }

    public subscribe() {
        if (!util.validateEmail(this.subscribeEmail)) {
            M.toast({ html: 'Enter an email address' });
            return;
        }

        this.api.subscribeToLocality(this.localityService.getPosition().coords, this.locality, this.subscribeEmail)
            .subscribe(json => {
                if (json.success) {
                    this.inforService.setSubscribedTo(this.locality, true);
                    M.toast({ html: 'Subscribed!' });
                } else {
                    M.toast({ html: 'That didn\'t work...' });
                }
            }, () => {
                    M.toast({ html: 'That didn\'t work...' });
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
