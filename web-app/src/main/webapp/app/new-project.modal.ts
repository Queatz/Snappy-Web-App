declare var $;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'new-project-modal',
    templateUrl: './new-project.modal.html',
    styleUrls: ['./new-project.modal.css'],
})
export class NewProjectModal implements AfterViewInit {
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

   newProject() {
       if (!this.name) {
           return;
       }

       this.api.earthCreate({
           kind: 'project',
           name: this.name,
           'in': this.asMemberOf ? this.asMemberOf.id : undefined
       }).subscribe(project => {
           $(this.element.querySelector('.modal')).modal('close');
           this.router.navigate(['/projects/' + project.id]);
       });
   }
}
