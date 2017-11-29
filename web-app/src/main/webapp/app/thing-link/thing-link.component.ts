import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import util from '../util';

@Component({
  selector: 'thing-link',
  templateUrl: './thing-link.component.html',
  styleUrls: ['./thing-link.component.css']
})
export class ThingLinkComponent implements OnInit {

  @Input() thing: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }


  public thingName(thing: any) {
      return util.thingName(thing);
  }

  public goUrlFor(thing: any) {
      if (!thing) {
          return;
      }

      return util.thingUrl(thing);
  }

  public getPhotoUrlFor(thing: any, sz: number) {
      return this.api.getPhotoUrlFor(thing, sz);
  }
}
