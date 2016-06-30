import { Component, ComponentResolver, ViewContainerRef, Injector, ElementRef, Input, provide, OnChanges, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from '@angular/http';
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
export class FloatingComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public color;
    @Input() public modal;
    @Input() public icon;
    @Input() public params;
    @Input() public tooltip;

    constructor(injector: Injector,
            private resolver: ComponentResolver,
            private view: ViewContainerRef,
            inforService: InforService,
            private router: Router,
            private route: ActivatedRoute, http: Http,
            private elementRef: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.router = router;
        this.element = elementRef.nativeElement;
        this.edetails = '';
        this.emessage = '';

        route.params.subscribe(params => {
            this.currentUrl = params.id;
        });
    }

    ngOnInit() {
        if (!this.color) {
            this.color = 'bkg-red';
        }

        if (!this.icon) {
            this.icon = 'add';
        }

        if (this.modal) {
            this.resolver.resolveComponent(this.modal).then(component => {
                this.view.createComponent(component);
            });
        }
    }

    ngAfterViewInit() {
        $(this.element).find('.modal-trigger').leanModal();
        $('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }

    userSignined() {
        return this.inforService.getInforUser();
    }

    getCurrentUrl() {
        return this.currentUrl;
    }
}
