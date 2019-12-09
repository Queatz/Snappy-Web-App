declare var M: any;
declare var Waves;
declare var $: any;

import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

/**
 * Earth
 */

@Component({
    selector: 'set-photo-modal',
    templateUrl: './set-photo.modal.html',
    styleUrls: ['./set-photo.modal.css']
})
export class SetPhotoModal implements AfterViewInit {
    @Input() public thing;
    private filesToUpload: Array<File>;

    private element;
    public efile;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
    }

    public uploadPhoto() {
        var previous = this.thing.photo;

        if (this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/)) {
           this.thing.photo = false;
            this.api.earthPutPhoto(this.thing.id, this.filesToUpload[0])
                .then(result => {
                    M.toast({ html: 'Photo updated' });
                    this.thing.photo = true;
                },
                error => {
                    this.thing.photo = previous;
                    M.toast({ html: 'Photo update failed' });
                });
        } else {
            this.thing.photo = previous;
            M.toast({ html: 'No photo' });
        }
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    deleteImage() {
        if (!this.thing) {
            return;
        }

        this.api.earthDeletePhoto(this.thing.id)
            .subscribe(res => {
                if (res.status == 200) {
                    M.toast({ html: 'Photo removed' });
                    this.thing.photo = false;
                } else {
                    M.toast({ html: 'Photo remove failed' });
                }
            },
            error => {
                M.toast({ html: 'Photo remove failed' });
            });
    }
}
