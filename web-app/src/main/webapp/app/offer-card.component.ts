import {Component, Input, AfterViewInit, ElementRef} from 'angular2/core';

@Component({
	selector: 'offer-card',
	templateUrl: 'app/offer-card.component.html',
	styleUrls: ['app/offer-card.component.css']
})
export class OfferCardComponent implements AfterViewInit {
    @Input() public offer;
    @Input() public resizeCallback;

    ngAfterViewInit(element: ElementRef) {
        Waves.displayEffect();
    }

    public getPrice() {
        var offer = this.offer;
        var str;

        if(offer.price < 0) {
            str = 'Make $' + Math.abs(offer.price);
        } else if (offer.price === 0) {
            return 'Free';
        } else {
            str = '$' + offer.price
        }

        if (offer.unit) {
            str = str + '/' + offer.unit;
        }

        return str;
    }

    public isRequest() {
        return this.offer.price < 0;
    }

    public getOfferTypeText() {
        if(this.isRequest()) {
            return this.offer.person.firstName + ' wants';
        } else {
            return this.offer.person.firstName + ' offers';
        }
    }

    public loaded() {
        this.resizeCallback();
    }
}
