import { Component, Input } from '@angular/core';

@Component({
  selector: 'thing-preview-list',
  templateUrl: './thing-preview-list.component.html',
  styleUrls: ['./thing-preview-list.component.css']
})
export class ThingPreviewListComponent {

  @Input() things: any[];
  
  public amount: number = 20;

  constructor() { }
  
  onBottomReached() {
      this.amount += 10;
  }
  
  byId(thing: any) {
      return thing.id;
  }
}
