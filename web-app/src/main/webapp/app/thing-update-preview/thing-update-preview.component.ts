declare var $: any;

import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import util from '../util';

@Component({
  selector: 'thing-update-preview',
  templateUrl: './thing-update-preview.component.html',
  styleUrls: ['./thing-update-preview.component.css']
})
export class ThingUpdatePreviewComponent implements OnInit {

  @Input() thing: any;
  
  constructor(private elementRef: ElementRef, private api: ApiService) { }
  
  ngOnInit() {
  }

  ngAfterViewInit() {
    $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
  }

  ngOnDestroy() {
      $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
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
