import { Component, ElementRef, Input, AfterViewInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/new-hub.modal.html',
    styleUrls: ['app/new-hub.modal.css']
})
export class NewHubModal implements AfterViewInit {
    @Input() modalId;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.name = '';
        this.address = '';
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('#hubVisibility')).material_select();
    }

    newHub() {
        if (!this.name || !this.address) {
            return;
        }

        this.api.earthCreate({
            kind: 'hub',
            name: this.name,
            address: this.address
        }).subscribe(hub => {
            $(this.element.querySelector('#modal')).closeModal();
            this.router.navigate(['Hub', {id: hub.id}]);
        });
    }
}
