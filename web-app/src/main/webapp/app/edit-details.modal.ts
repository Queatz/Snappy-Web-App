import { Component, ElementRef, Input, AfterViewInit } from 'angular2/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'edit-details-modal',
    templateUrl: 'app/edit-details.modal.html',
    styleUrls: ['app/edit-details.modal.css']
})
export class EditDetailsModal implements AfterViewInit {
    @Input() thing;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('#visibility')).material_select();

        this.name = this.thing.name;
        this.about = this.thing.about;
        this.address = this.thing.address;
        this.visibility = '';
    }

    save() {
        if (!this.name || !this.address) {
            return;
        }

        this.api.earthEdit(this.thing.id, {
            name: this.name,
            address: this.address,
            about: this.about
        }).subscribe(success => {
            this.thing.name = this.name;
            this.thing.address = this.address;
            this.thing.about = this.about;
            $(this.element.querySelector('#editDetailsModal')).closeModal();
        });
    }
}
