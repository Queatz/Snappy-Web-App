import { Component, Input, OnInit, ElementRef, AfterViewInit, OnChanges, provide } from 'angular2/core';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import 'rxjs/add/operator/map';
import { OfferCardComponent } from './offer-card.component'
import { InforService } from './infor.service';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}

@Component({
    selector: 'offers',
    templateUrl: 'app/offers.component.html',
    styleUrls: ['app/offers.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, { useClass: MyOptions })],
    directives: [OfferCardComponent]
})
export class OffersComponent implements OnInit, AfterViewInit {
    public offers = [];
    public offersLoaded = false;
    private masonry: Masonry;
    private person;
    private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';

    @Input() public profile;
    @Input() public list;

    constructor(private router: Router, inforService: InforService, http: Http, element: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.router = router;
        this.element = element.nativeElement;
        this.boundResizeCallback = this.resizeCallback.bind(this);
        this.boundDeleteCallback = this.deleteCallback.bind(this);
    }

    ngOnInit() {
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
        this.inforService.setProfileUpdateOffer(this.boundDeleteCallback, this.profile);
        this.signed = !!this.inforService.getInforUser();
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
    
    getOfferPosition(position) {
        return position + this.inforService.getOfferSize();
    }
}
