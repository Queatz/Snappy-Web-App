import {Component, Input, OnInit, ElementRef, AfterViewInit, provide} from 'angular2/core';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';
import 'rxjs/add/operator/map';
import {OfferCardComponent} from './offer-card.component'

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
  headers: Headers = firstHeaders
}

@Component({
	selector: 'offers',
	templateUrl: 'app/offers.component.html',
	styleUrls: ['app/offers.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})],
    directives: [OfferCardComponent]
})
export class OffersComponent implements OnInit, AfterViewInit {
    public offers = [];
    public offersLoaded = false;
    private masonry: Masonry;
    private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';

    @Input() public personId;

    constructor(http: Http, element: ElementRef) {
        this.http = http;
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
    }

    ngOnInit() {
        if (this.personId) {
            this.loadPerson(this.personId);
        } else {
            // Load San Francisco first right away
            this.loadNearby({
                coords: {
                    latitude: 37.7733717,
                    longitude: -122.47393849999997
                }
            });

            // Then try to ask for their real location
            navigator.geolocation.getCurrentPosition(this.loadNearby.bind(this));
        }
    }

    loadPerson(personId) {
        this.http.get('http://queatz-snappy.appspot.com/api/people/' + personId + '?auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(person => {
               this.loaded(person.offers);
            });
    }

    loadNearby(position) {
        if (!position) {
            return;
        }

        this.http.get('http://queatz-snappy.appspot.com/api/here?latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude + '&auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(here => {

                // If there aren't any offers near them, then bail.
                if (here.offers.length < 1) {
                    return;
                }

                this.loaded(here.offers);
            });
    }

    loaded(offers) {
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

    ngAfterViewInit() {

    }

    resizeCallback() {
        if (this.masonry) {
            this.masonry.layout();
        }
    }
}
