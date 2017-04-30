declare var $;
declare var Waves;
declare var _;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

import { MapComponent } from './map.component';

@Component({
    selector: 'edit-details-modal',
    templateUrl: './edit-details.modal.html',
    styleUrls: ['./edit-details.modal.css'],
})
export class EditDetailsModal implements AfterViewInit {
    @Input() thing;

    @ViewChild(MapComponent)
    private map: MapComponent;
    private element;
    private name;
    private about;
    private visibility;
    private address;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('#visibility')).material_select();
        $(this.element.querySelectorAll('.modal')).modal();

        switch (this.thing.kind) {
            case 'hub':
                this.name = this.thing.name;
                this.about = this.thing.about;
                this.address = this.thing.address;
                this.visibility = ['1'];
                break;
            case 'resource':
            case 'project':
                this.name = this.thing.name;
                this.about = this.thing.about;
                break;
        }
    }

    updateAddress() {
        this.map.updateAddress(this.address);
    }

    save() {
        switch (this.thing.kind) {
            case 'hub':
                return this.saveHub();
            case 'resource':
            case 'project':
                return this.saveResource();
        }
    }

    public canEdit() {
        if (!this.inforService.getInforUser()) {
            return false;
        }

        var me = this.inforService.getInforUser().id;

        return this.thing && _.any(this.thing.contacts, t => t.source.target.id === me);
    }

    remove() {
        $(this.element.querySelector('#modal-remove')).modal('open');
    }

    confirmRemove() {
        this.api.earthDelete(this.thing.id).subscribe(() => {
            $(this.element.querySelector('#modal-remove')).modal('close');
           this.router.navigate(['/']);
        })
    }

    saveResource() {
        if (!this.name) {
            return;
        }

        this.api.earthEdit(this.thing.id, {
            name: this.name,
            about: this.about
        }).subscribe(success => {
            this.thing.name = this.name;
            this.thing.about = this.about;
            $(this.element.querySelector('#editDetailsModal')).modal('close');
        });
    }

    saveHub() {
        if (!this.name || !this.address) {
            return;
        }

        this.api.earthEdit(this.thing.id, {
            name: this.name,
            address: this.address,
            about: this.about,
            latitude: this.map.getMarkerPosition().lat(),
            longitude: this.map.getMarkerPosition().lng()
        }).subscribe(success => {
            this.thing.name = this.name;
            this.thing.address = this.address;
            this.thing.about = this.about;
            $(this.element.querySelector('#editDetailsModal')).modal('close');
        });
    }
}
