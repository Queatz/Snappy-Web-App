declare var $: any;

import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import util from '../util';

@Component({
  selector: 'thing-link',
  templateUrl: './thing-link.component.html',
  styleUrls: ['./thing-link.component.css']
})
export class ThingLinkComponent implements OnInit, AfterViewInit {

    @Input() thing: any;
    @Input() large: boolean;
    @Input() small: boolean;

  constructor(private elementRef: ElementRef, private api: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
      $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
  }

  ngOnDestroy() {
      $(this.elementRef.nativeElement).find('.tooltipped').tooltip('close');
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
