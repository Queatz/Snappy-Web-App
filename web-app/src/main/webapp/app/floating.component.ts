import { Component, ElementRef, provide, OnChanges, AfterViewInit } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { InforService } from './infor.service';

var checkFirst = true;
var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}
@Component({
    selector: 'floating',
    templateUrl: 'app/floating.component.html',
    styleUrls: ['app/floating.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, { useClass: MyOptions })]
})
export class FloatingComponent implements AfterViewInit {
    constructor(inforService: InforService, private router: Router, private routeParams: RouteParams, http: Http, element: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.router = router;
        this.element = element.nativeElement;
        this.edetails = '';
        this.emessage = '';
    }

    ngAfterViewInit() {
        $(this.element).find('.modal-trigger').leanModal();
    }

    userSignined() {
        return this.inforService.getInforUser();
    }

    getCurrentUrl() {
        return this.routeParams.get('id');
    }

    newOffer(edetails, emessage, enumber) {
        if (enumber === undefined)
            enumber = '0';
        this.token = this.inforService.getInforUser().auth;
        if (edetails !== undefined && edetails != '') {
            $(this.element).find('#model1').closeModal();
            var creds = "auth=" + this.token + "&details=" + edetails + "&price=" + enumber + "&unit=" + emessage;
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            this.http.post('http://queatz-snappy.appspot.com/api/me/offers', creds, {
                headers: headers
            })
                .map(res => res.json())
                .subscribe(dataInput => {
                    if (dataInput.id) {
                        Materialize.toast('Offer success!', 4000);
                        this.inforService.setNewOffer(dataInput);
                        this.edetails = '';
                        this.emessage = '';
                    }
                });
        }
    }

}
