declare var moment: any

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  @Input() date: any;

  constructor() { }

  ngOnInit() {
  }

  public time() {
      return moment(this.date).fromNow();
  }

  public timeExact() {
      return moment(this.date).calendar(null, {
          sameElse: 'MMMM Do YYYY, h:mm A'
      });
  }

}
