declare var $;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'new-resource-modal',
    templateUrl: './new-resource.modal.html',
    styleUrls: ['./new-resource.modal.css'],
})
export class NewResourceModal implements AfterViewInit {
    @Input() modalId;
    @Input() asMemberOf;
    private filesToUpload: Array<File>;

    private element;
    public name;
    public efile;
    private thing;

    public isPublic: any;
    public clubs: any;

   constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
       this.element = element.nativeElement;
       this.name = '';
       this.isPublic = true;
       this.clubs = {};

       this.inforService.getLocation((position) => {
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
       $(this.element.querySelector('.modal')).modal();
   }

   newResource() {
       if (!this.name) {
           return;
       }

       var isFile = this.filesToUpload && this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/);

       this.api.earthCreate({
           kind: 'resource',
           name: this.name,
           photo: isFile ? this.filesToUpload[0] : undefined,
           hidden: !this.isPublic,
           clubs: JSON.stringify(this.clubs),
           'in': this.asMemberOf ? this.asMemberOf.id : ''
       }, true).then(resource => {
           resource = JSON.parse(resource);

           $(this.element.querySelector('.modal')).modal('close');
           this.router.navigate(['/resources/' + resource.id]);
       });
   }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
