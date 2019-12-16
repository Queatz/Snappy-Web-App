declare var $: any;
declare var M: any;
declare var Waves: any;

import { Component, ElementRef, Input, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'new-offer-modal',
    templateUrl: './new-offer.modal.html',
    styleUrls: ['./new-offer.modal.css']
})
export class NewOfferModal implements OnInit, AfterViewInit, OnDestroy{
    @Input() modalId;
    @Input() offer;
    @Input() asMemberOf;
    @Input() resizeCallback;

    public element;
    public inforService;
    public enumber;
    public edetails;
    public emessage;
    public justAsk;
    public isWant;
    public name;

    public isPublic: any;
    public clubs: any;

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

        this.refreshClubToggles();
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
        $(this.element.querySelector('.modal')).modal();
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('close');
    }

    isRequest() {
        return this.enumber < 0 || this.isWant;
    }

    refreshClubToggles() {
        this.clubs = {};

        if (!this.offer) {
            this.isPublic = true;
            return;
        }

        this.isPublic = !this.offer.hidden;

        if (this.offer.clubs) {
            this.offer.clubs.forEach(club => {
                this.clubs[club.id] = true;
            });
        }
    }

    newOffer() {
        var edetails = this.edetails;
        var emessage = this.emessage;
        var enumber = this.enumber;

        if (!edetails) {
            M.toast({ html: 'Describe your ' + (this.isRequest() ? 'request' : 'offer') });
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
            this.api.editOffer(this.offer.id, edetails, enumber, emessage, this.isWant, {
                hidden: !this.isPublic,
                clubs: JSON.stringify(this.clubs)
            })
                .subscribe(offer => {
                    if (offer.id) {
                        self.offer.price = offer.price;
                        self.offer.unit = offer.unit;
                        self.offer.about = offer.about;
                        self.offer.want = offer.want;
                        M.toast({ html: 'Offer updated' });

                        if (self.resizeCallback) {
                            self.resizeCallback();
                        }
                    }
                });

            return;
        }

        let asMemberOf = this.asMemberOf;

        this.api.newOffer(edetails, enumber, emessage, this.asMemberOf, this.isWant, {
            hidden: !this.isPublic,
            clubs: JSON.stringify(this.clubs)
        }).subscribe(member => {
                if (member.id) {
                    M.toast({ html: 'Offer added' });
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
