import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    submit() {
        if (!this.feedback) {
            return;
        }

        this.api.sendFeedback(this.feedback).subscribe(() => {
            $(this.element).find('#feedbackModal').closeModal();
            Materialize.toast('Thanks!', 4000);
            this.feedback = '';
        }, () => {
            Materialize.toast('That didn\'t work...', 4000);
        });
    }
}
