declare var $;
declare var Waves;

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'mode-view',
  templateUrl: './mode-view.component.html',
  styleUrls: ['./mode-view.component.css']
})
export class ModeViewComponent implements OnInit, AfterViewInit {

    @Input() mode;

    constructor(private api: ApiService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    getPhoto() {
        return this.api.getPhotoUrlFor(this.mode, 200);
    }
}
