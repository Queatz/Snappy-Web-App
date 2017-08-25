declare var $;
declare var Waves;
declare var _;

import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

import { MapComponent } from './map.component';

@Component({
    selector: 'edit-details-modal',
    templateUrl: './edit-details.modal.html',
    styleUrls: ['./edit-details.modal.css'],
})
export class EditDetailsModal implements OnInit, AfterViewInit {
    @Input() thing;

    @ViewChild(MapComponent)
    private map: MapComponent;
    private element;
    private name;
    private about;
    private clubs;
    private address;

    public allClubs = [
        'Public',
        'Esther\'s Club',
        'Clexsa\'s Club',
        'Mai\'s Coffee Garden'
    ];

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngOnInit() {
        this.clubs = {};

        switch (this.thing.kind) {
            case 'hub':
                this.name = this.thing.name;
                this.about = this.thing.about;
                this.address = this.thing.address;
                break;
            case 'resource':
            case 'project':
            case 'form':
            case 'club':
                this.name = this.thing.name;
                this.about = this.thing.about;
                break;
        }
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelectorAll('.modal')).modal();
    }

    updateAddress() {
        this.map.updateAddress(this.address);
    }

    isCommon() {
        return this.thing.kind === 'resource' ||
            this.thing.kind === 'project' ||
            this.thing.kind === 'form' ||
            this.thing.kind === 'club';
    }

    save() {
        switch (this.thing.kind) {
            case 'hub':
                return this.saveHub();
            case 'resource':
            case 'project':
            case 'form':
            case 'club':
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
        if (!this.name) {
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
