declare var $;
declare var _;
declare var Materialize;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'remove-contact-modal',
    templateUrl: './remove-contact.modal.html',
    styleUrls: ['./remove-contact.modal.css'],
})
export class RemoveContactModal implements AfterViewInit {
    @Input() thing;
    @Input() contact;

    private element;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
    }

    remove() {
        if (!this.contact) {
            return;
        }

        this.api.earthDelete(this.contact.id).subscribe(contact => {
            $(this.element.querySelector('.modal')).modal('close');
            if (this.thing && this.thing.contacts) {
                _.remove(this.thing.contacts, c => c.source && this.contact.id === c.source.id);
                Materialize.toast(this.contact.target.firstName + ' removed', 4000);
            }
        });
    }
}
