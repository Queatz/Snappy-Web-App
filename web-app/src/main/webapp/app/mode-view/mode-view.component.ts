declare var $;
declare var _;
declare var Waves;
declare var Materialize;

import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';

import { ApiService } from '../api.service';
import { InforService } from '../infor.service';

@Component({
  selector: 'mode-view',
  templateUrl: './mode-view.component.html',
  styleUrls: ['./mode-view.component.css']
})
export class ModeViewComponent implements OnInit, AfterViewInit {

    @Input() mode;

    constructor(private api: ApiService, private info: InforService, private elementRef: ElementRef) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    getPhoto() {
        return this.api.getPhotoUrlFor(this.mode, 200);
    }

    setPhoto() {
        $(this.elementRef.nativeElement).find('#photoUploadInput').click();
    }

    me() {
        return this.info.getInforUser();
    }

    mePhoto(sz: number) {
        return this.api.getPhotoUrlFor(this.me(), sz);
    }

    isOn() {
        return this.info.getInforUser() &&
            this.info.getInforUser().modes &&
            _.any(this.me().modes, m => m.source.id === this.mode.id);
    }

    turnOn() {
        this.api.earthCreate({
            kind: 'member',
            source: this.mode.id,
            target: this.me().id,
            select: 'id'
        }).subscribe(() => {
            Materialize.toast(this.mode.name + ' on');
        });
    }

    turnOff() {
        let member = _.filter(this.me().modes, m => m.source.id === this.mode.id);

        if (!member.length) {
            return;
        }

        this.api.earthDelete(member[0].id).subscribe(() => {
            Materialize.toast(this.mode.name + ' off');
        });
    }

    onPhotoUpload(event: Event) {
        let file = (event.target as HTMLInputElement).files[0];
        
        if (file) {
            this.api.earthPutPhoto(this.mode.id, file).then(r => {});
        }
    }

}
