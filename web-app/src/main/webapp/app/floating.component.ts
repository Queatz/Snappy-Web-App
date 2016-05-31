import { Component, DynamicComponentLoader, Injector, ElementRef, Input, provide, OnChanges, OnInit, AfterViewInit } from 'angular2/core';
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
export class FloatingComponent implements OnInit, AfterViewInit {
    @Input() public color;
    @Input() public modal;
    @Input() public icon;
    @Input() public params;

    constructor(private dcl: DynamicComponentLoader, injector: Injector, inforService: InforService, private router: Router, private routeParams: RouteParams, http: Http, private elementRef: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.router = router;
        this.element = elementRef.nativeElement;
        this.edetails = '';
        this.emessage = '';
    }

    ngOnInit() {
        if (!this.color) {
            this.color = 'bkg-red';
        }

        if (!this.icon) {
            this.icon = 'add';
        }

        if (this.modal) {
            this.dcl.loadNextToLocation(this.modal, this.elementRef);
        }
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
}
