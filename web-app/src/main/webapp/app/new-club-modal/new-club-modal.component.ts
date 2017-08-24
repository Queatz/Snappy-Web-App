declare var $;
declare var Waves;

import { Component, OnInit, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'new-club-modal',
  templateUrl: './new-club-modal.component.html',
  styleUrls: ['./new-club-modal.component.css']
})
export class NewClubModalComponent implements AfterViewInit {
   @Input() modalId;
   @Input() asMemberOf;

   private element: HTMLElement;
   public name: string;
   private thing: Object;

   constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
       this.element = element.nativeElement;
       this.name = '';

       this.thing = {};
   }

   ngAfterViewInit() {
       Waves.displayEffect();
       $(this.element.querySelector('.modal')).modal();
   }

   newClub() {
       if (!this.name) {
           return;
       }

       this.api.earthCreate({
           kind: 'club',
           name: this.name
       }).subscribe(club => {
           $(this.element.querySelector('.modal')).modal('close');
           this.router.navigate(['/clubs/' + club.id]);
       });
   }
}
