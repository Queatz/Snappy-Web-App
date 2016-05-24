import { Component, ElementRef, Input } from 'angular2/core';
import { ApiService } from './api.service';
import { InforService } from './infor.service';

@Component({
    selector: 'post-update-modal',
    templateUrl: 'app/post-update.modal.html',
    styleUrls: ['app/post-update.modal.css']
})
export class PostUpdateModal implements OnInit, AfterViewInit {
    @Input() thing;
    private filesToUpload: Array<File>;
    public message;

    constructor(
        private inforService: InforService,
        private api: ApiService,
        element: ElementRef
    ) {
        this.element = element.nativeElement;
    }

    public post() {
        var isFile = this.filesToUpload && this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/);

        if (this.message || isFile) {
            this.api.earthPostUpdate(this.thing.id, this.message, isFile ? this.filesToUpload[0] : null)
                .then(result => {
                    if (_.isArray(this.thing.updates)) {
                        this.thing.updates.unshift(result);
                    }

                    Materialize.toast('Update posted', 4000);
                },
                error => {
                    Materialize.toast('Post update failed', 4000);
                });
        } else {
            Materialize.toast('Image or message required', 4000);
        }
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
