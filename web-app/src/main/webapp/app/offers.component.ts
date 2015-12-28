import {Component, OnInit, provide} from 'angular2/core';
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
	styles: ['.narrow { max-width: 800px; margin: 0 auto; }'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})],
    directives: [OfferCardComponent]
})
export class OffersComponent implements OnInit {
    public offers = [];
    private url = 'http://queatz-snappy.appspot.com/api/here?latitude=37.7800958&longitude=-122.4605237&auth=ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';

    constructor(http: Http) {
        this.http = http;
    }

    ngOnInit() {
        this.http.get(this.url)
            .map((res: Response) => res.json())
            .subscribe(here => {
            this.offers = _.sortBy(here.offers, 'price');
            });
    }
}
