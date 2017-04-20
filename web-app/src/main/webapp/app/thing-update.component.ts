declare var require: any;
declare var $: any;
declare var Waves: any;
var moment = require('moment');
var Masonry = require('masonry-layout');

import { Component, ComponentFactoryResolver, ViewContainerRef, OnInit, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { InforService } from './infor.service';
import { PostUpdateModal } from './post-update.modal';

var checkFirst = true;

@Component({
    selector: 'thing-update',
    templateUrl: 'app/thing-update.component.html',
    styleUrls: ['app/thing-update.component.css']
})
export class ThingUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public update;
    @Input() public resizeCallback;

    private element: HTMLElement;
    private modal;
    private cr;
    private updateImage;

    constructor(private inforService: InforService,
            private api: ApiService,
            private elementRef: ElementRef,
            private resolver: ComponentFactoryResolver,
            private view: ViewContainerRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        if (this.update.kind === 'member') {
            this.member = this.update;
            this.update = this.update.source;
        }
    }

    edit() {
        if (this.modal) {
            this.modal.modal('open');
            return;
        }

        var self = this;

        let ref = this.view.createComponent(this.resolver.resolveComponentFactory(PostUpdateModal));
        ref.instance.update = self.update;
        self.modal = $(ref.location.nativeElement).find('.modal');
        setTimeout(() => self.modal.modal('open'));
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        this.updateImage = this.api.earthImageUrl(this.update.id);
    }

    isMine() {
        return this.inforService.getInforUser() &&
            this.update.source.id === this.inforService.getInforUser().id;
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    public loaded() {
        this.resizeCallback();
    }

    public time() {
        return moment(this.update.date).fromNow();
    }
}
