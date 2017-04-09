declare var $;
declare var Waves;

import { Component, ComponentFactoryResolver, ViewContainerRef, Injector, ElementRef, Input, OnChanges, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { InforService } from './infor.service';

var checkFirst = true;

@Component({
    selector: 'floating',
    templateUrl: 'app/floating.component.html',
    styleUrls: ['app/floating.component.css'],
})
export class FloatingComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public color;
    @Input() public modal;
    @Input() public icon;
    @Input() public params;
    @Input() public tooltip;

    private inforService;
    private http;
    private element;
    private edetails;
    private emessage;
    private currentUrl;

    constructor(injector: Injector,
            private resolver: ComponentFactoryResolver,
            private view: ViewContainerRef,
            inforService: InforService,
            private router: Router,
            private route: ActivatedRoute,
            http: Http,
            private elementRef: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.router = router;
        this.element = elementRef.nativeElement;
        this.edetails = '';
        this.emessage = '';

        route.params.subscribe(params => {
            this.currentUrl = params['id'];
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
            this.view.createComponent(this.resolver.resolveComponentFactory(this.modal));
        }
    }

    ngAfterViewInit() {
        $(this.element).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    userSignined() {
        return this.inforService.getInforUser();
    }

    getCurrentUrl() {
        return this.currentUrl;
    }
}
