declare var $;
declare var _;
declare var moment;

import { Component, Input, OnInit, ElementRef, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
    private person;

    @Input() public list;

    private element;
    private boundResizeCallback;
    private boundRemoveCallback;
    private token;
    private signed;

    public amount: number = 20;

    constructor(private router: Router, private inforService: InforService, private api: ApiService, element: ElementRef) {
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
        this.boundRemoveCallback = this.removeCallback.bind(this);
    }

    public onBottomReached() {
        this.amount += 10;
    }

    ngOnInit() {
        var self = this;

        var config = { childList: true };

        if (this.list === undefined) {
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

        this.api.earthHere(position.coords, 'offer|update', 'date,photo,about,going,owner,likers,liked,likes(source(firstName,lastName,imageUrl,googleUrl)),members(source(about,date,source(name,firstName,lastName,imageUrl,googleUrl))),in(target(name,firstName,lastName,imageUrl,googleUrl)),joins(target(name,firstName,lastName,googleUrl,imageUrl,photo),source(name,firstName,imageUrl,photo,lastName,imageUrl,googleUrl)),source(imageUrl,googleUrl,firstName,lastName),clubs(name)')
            .subscribe(offers => {
                this.loaded(_.sortBy(offers, thing => -moment(thing.date)));
            }, error => {
                this.loaded([]);
            });
    }

    public loaded(offers) {
        this.offersLoaded = true;
        this.offers = offers;
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
    }

    resizeCallback() {
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

    byId(thing: any) {
        return thing.id;
    }
}
