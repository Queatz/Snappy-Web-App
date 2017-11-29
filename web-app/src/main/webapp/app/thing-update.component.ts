declare var require: any;
declare var $: any;
declare var Waves: any;

import { Component, ComponentFactoryResolver, ViewContainerRef, OnInit, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { InforService } from './infor.service';
import { PostUpdateModal } from './post-update.modal';

var checkFirst = true;

@Component({
    selector: 'thing-update',
    templateUrl: './thing-update.component.html',
    styleUrls: ['./thing-update.component.css']
})
export class ThingUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public update;
    @Input() public resizeCallback;
    @Input() public isComment;

    private element: HTMLElement;
    private modal;
    private cr;
    private updateImage;
    private member;
    private __atWith;

    comments: any[] = null;

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

        if (this.update.members) {
            this.comments = this.update.members.map(c => c.source).filter(c => c.kind === 'update');
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

    public atWith() {
        if (this.__atWith) {
            return this.__atWith;
        }

        if (!this.update.joins || !this.update.joins.length) {
            return null;
        }

        let result = {
            with: [],
            at: []
        };

        this.update.joins.forEach(join => {
            switch (join.source.kind) {
                case 'person':
                    result.with.push({ person: join.source, isLast: false });
                    break;
                case 'hub':
                    result.at.push({ hub: join.source, going: this.update.going });
                    break;
            }
        });

        if (!result.with.length && !result.at.length) {
            return null;
        }

        if (result.with.length) {
            result.with[result.with.length - 1].isLast = true;
        }

        this.__atWith = result;

        return result;
    }

    byId(update: any) {
        return update.id;
    }
}
