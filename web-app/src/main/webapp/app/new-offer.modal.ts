import { Component, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/new-offer.modal.html',
    styleUrls: ['app/new-offer.modal.css']
})
export class NewOfferModal implements AfterViewInit, OnDestroy{
    @Input() modalId;

    constructor(private api: ApiService, inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.edetails = '';
        this.emessage = '';
    }

    ngAfterViewInit() {
        $('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }

    newOffer(edetails, emessage, enumber) {
        if (!edetails) {
            Materialize.toast('Describe your ' + (this.enumber < 0 ? 'request' : 'offer'), 4000);
            return;
        }

        if (this.justAsk) {
            enumber = '';
        } else if (!enumber) {
            enumber = '0';
        }

        $(this.element.querySelector('#modal')).closeModal();

        this.api.newOffer(edetails, enumber, emessage)
            .subscribe(dataInput => {
                if (dataInput.id) {
                    Materialize.toast('Offer added', 4000);
                    this.inforService.setNewOffer(dataInput);
                    this.edetails = '';
                    this.emessage = '';
                }
            });
    }
}
