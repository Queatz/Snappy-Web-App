declare var $;
declare var _;
declare var Materialize;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { MapComponent } from './map.component';

@Component({
    selector: 'remove-contact-modal',
    templateUrl: 'app/remove-contact.modal.html',
    styleUrls: ['app/remove-contact.modal.css'],
    directives: [MapComponent]
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
    }

    remove() {
        if (!this.contact) {
            return;
        }

        this.api.earthDelete(this.contact.id).subscribe(contact => {
            $(this.element.querySelector('#removeContactModal')).closeModal();
            if (this.thing && this.thing.contacts) {
                _.remove(this.thing.contacts, this.contact);
                Materialize.toast(this.contact.target.firstName + ' removed', 4000);
            }
        });
    }
}
