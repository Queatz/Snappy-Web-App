declare var $: any;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

@Component({
    selector: 'new-form-modal',
    templateUrl: './new-form.modal.html',
    styleUrls: ['./new-form.modal.css'],
})
export class NewFormModal implements AfterViewInit {
    @Input() modalId;
    @Input() asMemberOf;
    private filesToUpload: Array<File>;

    public isPublic: any;
    public clubs: any;

    private element;
    public name;

   constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
       this.element = element.nativeElement;
       this.name = '';
       this.isPublic = true;
       this.clubs = {};
   }

   ngAfterViewInit() {
       Waves.displayEffect();
       $(this.element.querySelector('.modal')).modal();
   }

   add() {
       if (!this.name) {
           return;
       }

       var isFile = this.filesToUpload && this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/);

       this.api.earthCreate({
           kind: 'form',
           name: this.name,
           hidden: !this.isPublic,
           clubs: JSON.stringify(this.clubs),
           'in': this.asMemberOf ? this.asMemberOf.id : undefined
       }, true).then(form => {
           form = JSON.parse(form);

           $(this.element.querySelector('.modal')).modal('close');
           this.router.navigate(['/forms/' + form.id]);
       });
   }
}
