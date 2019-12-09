declare var Waves: any;
declare var $: any;
declare var M: any;

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

    public description: string;
    public name: string;

    constructor(private elementRef: ElementRef, private inforService: InforService) { }

    ngOnInit() {

    }

    add() {
        if (!this.inforService.getInforUser()) {
            M.toast({ html: 'Sign into Village to post ads' });
            return;
        }

        if (!this.name) {
            M.toast({ html: 'Add the ad title' });
            return;
        }

        if (!this.description) {
            M.toast({ html: 'Add the ad details' });
            return;
        }

        this.onAddAd.emit({
            topic: this.topic,
            description: this.description,
            name: this.name,
            date: new Date(),
            source: this.inforService.getInforUser().id,
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
