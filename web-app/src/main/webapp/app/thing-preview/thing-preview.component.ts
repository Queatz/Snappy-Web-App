declare var Waves: any;
declare var _: any;

import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';

@Component({
  selector: 'thing-preview',
  templateUrl: './thing-preview.component.html',
  styleUrls: ['./thing-preview.component.css']
})
export class ThingPreviewComponent implements OnInit, AfterViewInit {

  @Input() thing: any;

  constructor(private api: ApiService, private info: InforService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Waves.displayEffect();
  }

  action() {
    this.api.join(this.thing.id, true).subscribe(() => {});
  }

  joined() {
    return this.info.getInforUser() && _.any(this.thing.joins, j => j.source.id === this.info.getInforUser().id);
  }

}
