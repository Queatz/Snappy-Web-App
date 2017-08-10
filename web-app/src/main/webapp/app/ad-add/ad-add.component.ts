declare var Waves: any;
declare var $: any;
declare var Materialize: any;

import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { InforService } from '../infor.service';

@Component({
  selector: 'ad-add-modal',
  templateUrl: './ad-add.component.html',
  styleUrls: ['./ad-add.component.css']
})
export class AdAddComponent implements OnInit, AfterViewInit {

    @Input() topic;
    @Output() onAddAd = new EventEmitter<any>();

    private description: string;
    private name: string;

    constructor(private elementRef: ElementRef, private inforService: InforService) { }

    ngOnInit() {

    }

    add() {
        if (!this.inforService.getInforUser()) {
            Materialize.toast('Create a Village account to post ads', 4000);
            return;
        }

        if (!this.name) {
            Materialize.toast('Add the ad title', 4000);
            return;
        }

        if (!this.description) {
            Materialize.toast('Add the ad details', 4000);
            return;
        }

        this.onAddAd.emit({
            topic: this.topic,
            description: this.description,
            name: this.name,
            date: new Date(),
            token: this.inforService.getInforUser().auth
        });

        this.description = '';
        this.name = '';

        $(this.elementRef.nativeElement.querySelector('.modal')).modal('close');
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.elementRef.nativeElement.querySelector('.modal')).modal();
    }
}
