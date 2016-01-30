import { Component, OnInit, ElementRef, provide } from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';
import { OffersComponent } from './offers.component';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
  headers: Headers = firstHeaders
}

@Component({
	templateUrl: 'app/profile.component.html',
	styleUrls: ['app/profile.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})],
	directives: [OffersComponent]
})
export class ProfileComponent implements OnInit {
    private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
    private offers;

    constructor(
        private router:Router,
        private routeParams:RouteParams,
        http: Http,
        element: ElementRef
    ) {
        this.http = http;
        this.element = element.nativeElement;
        this.offers = null;
        this.person = null;
    }

    ngOnInit() {
        let id = this.routeParams.get('id');
        this.loadPerson(id);
    }

    loaded(offers) {
        this.offers = offers;
    }

    loadPerson(personId) {
        this.http.get('http://queatz-snappy.appspot.com/api/people/by-name/' + personId + '?auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(person => {
                this.person = person;
                this.loaded(person.offers);
            });
    }
}
