declare var _: any;
declare var $: any;
declare var Waves: any;

import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, ComponentRef } from '@angular/core';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';
import { NewOfferModal } from './new-offer.modal';
import { ApiService } from './api.service';
import { UiService } from './ui.service';
import { PostUpdateModal } from './post-update.modal';
import { Router } from '@angular/router';

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnInit, OnDestroy {
    private inforService;
    private newOfferModal;
    private modal: ComponentRef<PostUpdateModal>;
    people: any[];
    modes: any[];

    constructor(private router: Router, private ui: UiService, private api: ApiService, inforService: InforService, private elementRef: ElementRef, public tutorial: TutorialService) {
        this.inforService = inforService;
        this.newOfferModal = NewOfferModal;
    }

    ngOnInit() {
        this.inforService.getLocation(position => {
            this.api.earthHere(position.coords, 'person|mode', ApiService.SELECT_PEOPLE_MINIMAL)
                .subscribe(things => {
                    this.people = _.filter(things, t => t.kind === 'person').sort(p => p.infoDistance);
                    this.modes = _.filter(things, t => t.kind === 'mode').sort(p => p.infoDistance);
                });
        });
    }
    
    postUpdate() {
        if (!this.modal) {
            this.modal = this.ui.show(PostUpdateModal);
            this.modal.instance.thing = this.inforService.getInforUser();
            this.modal.instance.onUpdatePosted.subscribe(() => {
                this.router.navigate(['/', this.inforService.getInforUser().googleUrl]);
            });
        }
    }

    onModalOpened(modal: ComponentRef<any>) {
        (modal.instance as NewOfferModal).asMemberOf = this.inforService.getInforUser();
    }

    newUser() {
        return !this.inforService.getInforUser();
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
        Waves.displayEffect();
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hostView.destroy();
        }

        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }
}
