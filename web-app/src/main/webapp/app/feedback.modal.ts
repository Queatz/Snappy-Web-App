declare var $: any;
declare var Waves;
declare var M: any;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'feedback-modal',
    templateUrl: './feedback.modal.html',
    styleUrls: ['./feedback.modal.css']
})
export class FeedbackModal implements AfterViewInit {
    public feedback: string;
    private element;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
    }

    submit() {
        if (!this.feedback) {
            return;
        }

        this.api.sendFeedback(this.feedback).subscribe(() => {
            $(this.element).find('#feedbackModal').modal('close');
            M.toast({ html: 'Thanks!' });
            this.feedback = '';
        }, () => {
            M.toast({ html: 'That didn\'t work...' });
        });
    }
}
