declare var Materialize;
declare var Waves;

import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

/**
 * Earth
 */

@Component({
    selector: 'set-photo-modal',
    templateUrl: 'app/set-photo.modal.html',
    styleUrls: ['app/set-photo.modal.css']
})
export class SetPhotoModal implements AfterViewInit {
    @Input() public thing;
    private filesToUpload: Array<File>;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    public uploadPhoto() {
        var previous = this.thing.photo;

        if (this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/)) {
           this.thing.photo = false;
            this.api.earthPutPhoto(this.thing.id, this.filesToUpload[0])
                .then(result => {
                    Materialize.toast('Photo updated', 4000);
                    this.thing.photo = true;
                },
                error => {
                    this.thing.photo = previous;
                    Materialize.toast('Photo update failed', 4000);
                });
        } else {
            this.thing.photo = previous;
            Materialize.toast('No photo', 4000);
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
                    Materialize.toast('Photo removed', 4000);
                    this.thing.photo = false;
                } else {
                    Materialize.toast('Photo remove failed', 4000);
                }
            },
            error => {
                Materialize.toast('Photo remove failed', 4000);
            });
    }
}
