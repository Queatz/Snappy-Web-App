import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'thing-list',
  templateUrl: './thing-list.component.html',
  styleUrls: ['./thing-list.component.css']
})
export class ThingListComponent implements OnInit {

  @Input() things: any[];

  @Output() onThingClicked = new EventEmitter<any>();

  constructor(private api: ApiService) { }  

  ngOnInit() {
  }


  select(index: number) {
    this.onThingClicked.emit(this.things[index]);
  }

  url(thing: any) {
      if (thing.kind === 'person') {
          return thing.imageUrl;
      }

      if (thing.photo) {
          return this.api.earthImageUrl(thing.id, 64);
      }
  }

  byId(thing: any) {
      return thing.id;
  }
}
