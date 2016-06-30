import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/new-resource.modal.html',
    styleUrls: ['app/new-resource.modal.css'],
})
export class NewResourceModal implements AfterViewInit {
   @Input() modalId;

   constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
       this.element = element.nativeElement;
       this.name = '';

       navigator.geolocation.getCurrentPosition((position) => {
           this.thing = {
               geo: {
                   latitude: position.coords.latitude,
                   longitude: position.coords.longitude
               }
           };
       });
   }

   ngAfterViewInit() {
       Waves.displayEffect();
   }

   newResource() {
       if (!this.name) {
           return;
       }

       this.api.earthCreate({
           kind: 'resource',
           name: this.name
       }).subscribe(resource => {
           $(this.element.querySelector('#modal')).closeModal();
           this.router.navigate(['/resources/' + resource.id]);
       });
   }
}
