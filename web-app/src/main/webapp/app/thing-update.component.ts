import { Component, ComponentResolver, ViewContainerRef, View, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ApiService } from './api.service';
import { InforService } from './infor.service';
import { PostUpdateModal } from './post-update.modal';

var checkFirst = true;

@Component({
    selector: 'thing-update',
    templateUrl: 'app/thing-update.component.html',
    styleUrls: ['app/thing-update.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ThingUpdateComponent implements AfterViewInit, OnDestroy {
    @Input() public update;
    @Input() public resizeCallback;

    constructor(private inforService: InforService,
            private api: ApiService,
            private elementRef: ElementRef,
            private cr: ComponentResolver,
            private view: ViewContainerRef) {
        this.element = elementRef.nativeElement;
    }

    edit() {
        if (this.modal) {
            this.modal.openModal();
            return;
        }

        var self = this;

        this.cr.resolveComponent(PostUpdateModal).then(component => {
            let ref = self.view.createComponent(component);
            ref.instance.update = self.update;
            self.modal = $(ref.location.nativeElement).find('.modal');
            self.modal.openModal();
        });
    }

    ngAfterViewInit() {
        Waves.displayEffect();
      	$('.tooltipped').tooltip({delay: 50});
        this.updateImage = this.api.earthImageUrl(this.update.id);
    }

    isMine() {
        return this.inforService.getInforUser() &&
            this.update.person.id === this.inforService.getInforUser().id;
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }

    public loaded() {
        this.resizeCallback();
    }

    public time() {
        return moment(this.update.date).fromNow();
    }
}
