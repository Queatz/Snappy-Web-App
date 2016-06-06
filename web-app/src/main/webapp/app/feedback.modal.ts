import { Component, ElementRef, Input, AfterViewInit, ViewChild } from 'angular2/core';
import { Router } from 'angular2/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'feedback-modal',
    templateUrl: 'app/feedback.modal.html',
    styleUrls: ['app/feedback.modal.css']
})
export class FeedbackModal implements AfterViewInit {
    public feedback: String;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    submit() {
        if (!this.feedback) {
            return;
        }

        this.api.earthCreate({
            kind: 'hub',
            name: this.name,
            address: this.address,
            latitude: this.map.getMarkerPosition().lat(),
            longitude: this.map.getMarkerPosition().lng()
        }).subscribe(hub => {
            $(this.element.querySelector('#feedbackModal')).closeModal();
        });
    }
}
