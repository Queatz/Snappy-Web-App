declare var Materialize;
declare var $;
declare var _;

import { Component, ElementRef, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { InforService } from './infor.service';

@Component({
    selector: 'post-update-modal',
    templateUrl: './post-update.modal.html',
    styleUrls: ['./post-update.modal.css']
})
export class PostUpdateModal implements OnInit, AfterViewInit {
    @Input() thing;
    @Input() update;

    @Output() onUpdatePosted = new EventEmitter();

    private filesToUpload: Array<File>;
    public message;

    private element;
    public efile;

    public checkingIn: boolean;
    public isGoing: boolean;
    public checkingInWithAt: any[] = [];
    private going: any;

    public isPublic: any;
    public clubs: any;

    constructor(
        private inforService: InforService,
        private api: ApiService,
        element: ElementRef
    ) {
        this.element = element.nativeElement;
    }

    ngOnInit() {
        this.clubs = {};

        if (this.update) {
            this.message = this.update.about;
            this.isPublic = !this.update.hidden;

            if (this.update.clubs) {
                this.update.clubs.forEach(club => {
                    this.clubs[club.id] = true;
                });
            }
        } else {
            this.isPublic = true;
        }
    }

    ngAfterViewInit() {
        $(this.element.querySelector('.modal')).modal();
    }

    public checkin(thing: any) {
        if (_.any(this.checkingInWithAt, t => thing.id === t.id)){
            return;
        }

        this.checkingInWithAt.push(thing);
        this.checkingIn = !this.checkingIn;

        if (thing.kind === 'hub') {
            if (this.isGoing) {
                this.going = thing;
            } else {
                this.going = null;
            }
        }
    }

    public removeCheckin(thing: any) {
        if (this.going && thing.id === this.going.id) {
            this.going = false;
        }

        _.pull(this.checkingInWithAt, thing);
    }

    public checkingInToHub() {
        return _.any(this.checkingInWithAt, h => h.kind === 'hub');
    }

    public kinds() {
        if (this.isGoing) {
            return 'hub';
        } else if (this.checkingInToHub()) {
            return 'person';
        } else {
            return 'person|hub';
        }
    }

    public remove() {
        this.api.earthDelete(this.update.id)
            .subscribe((res: any) => {
                if (res.status == 200) {
                    Materialize.toast('Update removed', 4000);
                    this.update.about = '';
                    this.update.photo = false;
                } else {
                    Materialize.toast('Update remove failed', 4000);
                }
            },
            error => {
                Materialize.toast('Update remove failed', 4000);
            });
    }

    public post() {
        var isFile = this.filesToUpload && this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/);

        if (this.update) {
            if (this.message || isFile || this.checkingInWithAt.length) {
                var previousPhoto = this.update.photo;

                if (isFile) {
                    this.update.photo = false;
                }

                this.api.earthSaveUpdate(this.update.id, this.message, isFile ? this.filesToUpload[0] : null, {
                    hidden: !this.isPublic,
                    clubs: JSON.stringify(this.clubs)
                }, this.checkingInWithAt.map(t => t.id))
                    .subscribe(result => {
                        var updated: Object = JSON.parse(result);

                        this.update.about = updated['about'];
                        this.update.photo = updated['photo'];

                        Materialize.toast('Update saved', 4000);
                    },
                    error => {
                        this.update.photo = previousPhoto;
                        Materialize.toast('Post update failed', 4000);
                    });
            }

            return;
        }

        var updates = this.thing.updates;

        if (this.message || isFile || this.checkingInWithAt.length) {
            this.api.earthPostUpdate(this.thing.id, this.message, isFile ? this.filesToUpload[0] : null, {
                hidden: !this.isPublic,
                clubs: JSON.stringify(this.clubs)
            }, this.checkingInWithAt.map(t => t.id), this.going !== null)
                .subscribe(result => {
                    const u = JSON.parse(result);
                    if (_.isArray(updates)) {
                        updates.unshift(u);
                    }

                    this.onUpdatePosted.emit(u);

                    Materialize.toast('Update posted', 4000);
                },
                error => {
                    Materialize.toast('Post update failed', 4000);
                });
        } else {
            Materialize.toast('Update is empty', 4000);
        }
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
