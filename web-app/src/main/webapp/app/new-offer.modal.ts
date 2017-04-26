declare var $;
declare var Materialize;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'new-offer-modal',
    templateUrl: 'app/new-offer.modal.html',
    styleUrls: ['app/new-offer.modal.css']
})
export class NewOfferModal implements OnInit, AfterViewInit, OnDestroy{
    @Input() modalId;
    @Input() offer;
    @Input() asMemberOf;
    @Input() resizeCallback;

    private element;
    private inforService;
    private enumber;
    private edetails;
    private emessage;
    private justAsk;
    private isWant;
    private name;

    constructor(private api: ApiService, inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.enumber = 0;
        this.edetails = '';
        this.emessage = '';
    }

    ngOnInit() {
        if (this.offer) {
            this.edetails = this.offer.about;
            this.emessage = this.offer.unit;

            if (this.offer.price === undefined) {
                this.justAsk = true;
            } else {
                this.justAsk = false;
                this.enumber = this.offer.price;
            }
        }
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element.querySelector('.modal')).modal();
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    isRequest() {
        return this.enumber < 0 || this.isWant;
    }

    newOffer() {
        var edetails = this.edetails;
        var emessage = this.emessage;
        var enumber = this.enumber;

        if (!edetails) {
            Materialize.toast('Describe your ' + (this.isRequest() ? 'request' : 'offer'), 4000);
            return;
        }

        if (this.justAsk) {
            enumber = '';
        } else if (!enumber) {
            enumber = '0';
        }

        $(this.element.querySelector('.modal')).modal('close');

        if (this.offer) {
            var self = this;
            this.api.editOffer(this.offer.id, edetails, enumber, emessage, this.isWant)
                .subscribe(offer => {
                    if (offer.id) {
                        self.offer.price = offer.price;
                        self.offer.unit = offer.unit;
                        self.offer.about = offer.about;
                        self.offer.want = offer.want;
                        Materialize.toast('Offer updated', 4000);

                        if (self.resizeCallback) {
                            self.resizeCallback();
                        }
                    }
                });

            return;
        }

        var asMemberOf = this.asMemberOf;

        this.api.newOffer(edetails, enumber, emessage, this.asMemberOf, this.isWant)
            .subscribe(member => {
                if (member.id) {
                    Materialize.toast('Offer added', 4000);
                    this.inforService.setNewOffer(member);
                    this.edetails = '';
                    this.emessage = '';

                    var k: string;

                    switch (member.kind) {
                        case 'person':
                            k = 'people';
                            break;
                        default:
                            k = member.kind + 's';
                    }

                    if (asMemberOf) {
                        if (!asMemberOf[k]) {
                            asMemberOf[k] = [];
                        }

                        asMemberOf[k].push(member);

                    }
                }
            });
    }
}
