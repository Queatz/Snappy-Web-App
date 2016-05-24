import { Component, ElementRef, Input, AfterViewInit, ViewChild } from 'angular2/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { MapComponent } from './map.component';

@Component({
    selector: 'edit-details-modal',
    templateUrl: 'app/edit-details.modal.html',
    styleUrls: ['app/edit-details.modal.css'],
    directives: [MapComponent]
})
export class EditDetailsModal implements AfterViewInit {
    @Input() thing;

    @ViewChild(MapComponent)
    private map: MapComponent;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('#visibility')).material_select();

        switch (this.thing.kind) {
            case 'hub':
                this.name = this.thing.name;
                this.about = this.thing.about;
                this.address = this.thing.address;
                this.visibility = '';
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
            $(this.element.querySelector('#editDetailsModal')).closeModal();
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
            $(this.element.querySelector('#editDetailsModal')).closeModal();
        });
    }
}
