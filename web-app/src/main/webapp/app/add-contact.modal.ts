declare var $;
declare var _;
declare var Waves;
declare var Materialize;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'add-contact-modal',
    templateUrl: 'app/add-contact.modal.html',
    styleUrls: ['app/add-contact.modal.css'],
})
export class AddContactModal implements AfterViewInit {
    @Input() thing;
    public text: string;
    public results;
    private newContact;
    public newContactName;
    public searching;
    private position;

    private element;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.results = [];
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    add() {
        if (!this.results.length) {
            return;
        }

        let person = this.results[0];

        this.api.earthCreate({
            kind: 'contact',
            person: person.id,
            thing: this.thing.id
        }).subscribe(contact => {
            if (this.thing.contacts) {
                this.thing.contacts.push(contact);
            }
            $(this.element.querySelector('#addContactModal')).closeModal();
            Materialize.toast(contact.target.firstName + ' added', 4000);
        });
    }

    search() {
        this.searching = true;
        if (!this.position) {
            navigator.geolocation.getCurrentPosition(this.doSearch.bind(this));
        } else {
            this.doSearch(this.position);
        }
    }

    select(index) {
        this.results = [this.results[index]];

        if (this.results.length) {
            this.newContactName = this.results[0].firstName;
        } else {
            this.newContactName = undefined;
        }
    }

    private doSearch(position) {
        this.position = position;
        this.api.earthSearch(position.coords, this.text, 'person').subscribe(results => {
            this.results = results;
            this.searching = false;

            if (results.length) {
                this.newContactName = results[0].firstName;
            } else {
                this.newContactName = undefined;
            }
        });
    }

    public canEdit() {
        if (!this.inforService.getInforUser()) {
            return false;
        }

        var me = this.inforService.getInforUser().id;

        return this.thing && _.any(this.thing.contacts, t => t.target.id === me);
    }
}