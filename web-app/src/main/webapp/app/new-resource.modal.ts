declare var $;
declare var Waves;

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
    private filesToUpload: Array<File>;

    private element;
    private name;
    private thing;

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

       var isFile = this.filesToUpload && this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/);


       this.api.earthCreate({
           kind: 'resource',
           name: this.name,
           photo: isFile ? this.filesToUpload[0] : undefined
       }).then(resource => {
           resource = JSON.parse(resource);

           $(this.element.querySelector('#modal')).closeModal();
           this.router.navigate(['/resources/' + resource.id]);
       });
   }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
