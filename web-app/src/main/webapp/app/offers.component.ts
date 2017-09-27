declare var $;
declare var _;
declare var moment;

import { Component, Input, OnInit, ElementRef, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

@Component({
    selector: 'offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit, AfterViewInit, OnDestroy {
    public offers = [];
    public offersLoaded = false;
    private masonry;
    private mutationObserver;
    private person;

    @Input() public list;

    private element;
    private boundResizeCallback;
    private boundRemoveCallback;
    private token;
    private signed;

    constructor(private router: Router, private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
        this.boundRemoveCallback = this.removeCallback.bind(this);
    }

    ngOnInit() {
        var self = this;

        this.mutationObserver = new MutationObserver((mutations) => {
          if (self.masonry) {
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
            this.inforService.getLocation(this.loadNearby.bind(this));
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

        this.api.earthHere(position.coords, 'offer|update')
            .subscribe(offers => {
                this.loaded(_.sortBy(offers, thing => -moment(thing.date)));
            }, error => {
                this.loaded([]);
            });
    }

    public loaded(offers) {
        this.offersLoaded = true;
        this.offers = offers;

        setTimeout(() => {
            this.masonry = util.masonry(this.element.querySelector('.grid'));
        });
    }

    public ngOnChanges() {
        if (this.list) {
            this.loaded(this.list);
        }
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});

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

    removeCallback(offer) {
        _.remove(this.offers, o => (
            o.kind === 'member' ? o.source.id === offer.id :
            o.kind === 'offer' ? o.id === offer.id : false
        ));
    }
    
    getOfferPosition(position) {
        return position;
    }

    isKind(thing: any, kind: string) {
        if (thing.kind === 'member') {
            return thing.source.kind === kind;
        }

        return thing.kind === kind;
    }
}
