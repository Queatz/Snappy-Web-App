import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/new-project.modal.html',
    styleUrls: ['app/new-project.modal.css'],
})
export class NewProjectModal implements AfterViewInit {
   @Input() modalId;

   constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
       this.element = element.nativeElement;
       this.name = '';

       this.thing = {};
   }

   ngAfterViewInit() {
       Waves.displayEffect();
   }

   newProject() {
       if (!this.name) {
           return;
       }

       this.api.earthCreate({
           kind: 'project',
           name: this.name
       }).subscribe(project => {
           $(this.element.querySelector('#modal')).closeModal();
           this.router.navigate(['/projects/' + project.id]);
       });
   }
}
