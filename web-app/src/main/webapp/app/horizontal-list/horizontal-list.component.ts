import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'horizontal-list',
  templateUrl: './horizontal-list.component.html',
  styleUrls: ['./horizontal-list.component.css']
})
export class HorizontalListComponent implements OnInit {

  @Input() wrap = false;

  constructor() { }

  ngOnInit() {
  }

}
