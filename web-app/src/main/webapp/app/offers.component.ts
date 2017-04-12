declare var $;
declare var _;
declare var require;
var Masonry = require('masonry-layout');

import { Component, Input, OnInit, ElementRef, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'offers',
    templateUrl: 'app/offers.component.html',
    styleUrls: ['app/offers.component.css'],
})
export class OffersComponent implements OnInit, AfterViewInit, OnDestroy {
    public offers = [];
    public offersLoaded = false;
    private masonry;
    private mutationObserver;
    private person;

    @Input() public profile;
    @Input() public list;

    private element;
    private boundResizeCallback;
    private boundDeleteCallback;
    private boundRemoveCallback;
    private token;
    private signed;

    constructor(private router: Router, private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
        this.boundDeleteCallback = this.deleteCallback.bind(this);
        this.boundRemoveCallback = this.removeCallback.bind(this);
    }

    ngOnInit() {
        var self = this;

        this.mutationObserver = new MutationObserver((mutations) => {
          if (self.masonry) {
            console.log(mutations);
            setTimeout(() => {
                self.masonry.reloadItems();
                self.masonry.layout();
            }, 100);
          }
        });

        var config = { childList: true };
        this.mutationObserver.observe(this.element.querySelector('.grid'), config);

        if (this.list === undefined) {
            // Load San Francisco first right away
            this.loadNearby({
                coords: {
                    latitude: 37.7733717,
                    longitude: -122.47393849999997
                }
            });

            // Then try to ask for their real location
            navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
        } else {

        }
    }

    loadNearby(position) {
        if (!position) {
            return;
        }

        if (this.inforService.getInforUser() !== undefined && this.inforService.getInforUser().auth !== undefined) {
            this.token = this.inforService.getInforUser().auth;
        }

        this.api.earthHere(position.coords, 'offer')
            .subscribe(offers => {
                // If there aren't any offers near them, then bail.
                if (offers.length < 1) {
                    return;
                }
                this.loaded(offers);
            }, error => {
                this.loaded([]);
            });
    }

    public loaded(offers) {
        this.offersLoaded = true;
        this.offers = _.sortBy(offers, 'price');

        setTimeout(() => {
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
        });
    }

    public ngOnChanges() {
        if (this.list) {
            this.loaded(this.list);
        }
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});

        this.inforService.setProfileUpdateOffer(this.boundDeleteCallback, this.profile);
        this.signed = !!this.inforService.getInforUser();
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
        this.mutationObserver.disconnect();
    }

    resizeCallback() {
        setTimeout(() => {
            if (this.masonry) {
                this.masonry.layout();
            }
        }, 100);
    }

    getProfile() {
        return this.profile;
    }

    deleteCallback(index, mode) {
        switch (mode) {
            case 1: //delete offer
                this.offers.splice(index, 1);
                this.inforService.setDeleteOffer(1);
                this.loaded(this.offers);
                break;
            case 2: //add offer
                this.offers.push(index);
                if(this.profile)
                    this.inforService.setDeleteOffer(-1);
                this.inforService.setOfferSize(this.offers.length);
                this.loaded(this.offers);
                break;
            case 3: //add photo
                this.loaded(this.offers);
                break;
        }
    }

    removeCallback(offer) {
        _.remove(this.offers, o => o.source.id === offer.id);
    }
    
    getOfferPosition(position) {
        return position + this.inforService.getOfferSize();
    }
}
