import { Component, ElementRef, Input } from 'angular2/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/new-hub.modal.html',
    styleUrls: ['app/new-hub.modal.css']
})
export class NewHubModal {
    @Input() modalId;

    constructor(private api: ApiService, inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.name = '';
    }

    newHub(name) {
        if (!name) {
            return;
        }

        $(this.element.querySelector('#modal')).closeModal();
    }
}
