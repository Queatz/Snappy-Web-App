declare var Waves: any;

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'complete-goal',
  templateUrl: './complete-goal.component.html',
  styleUrls: ['./complete-goal.component.css']
})
export class CompleteGoalComponent implements OnInit, AfterViewInit {

  notFound: boolean;
  thing: any;

  constructor(
    private api: ApiService,
    private inforService: InforService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.load(params['id']);
    });
  }

  ngAfterViewInit() {
    Waves.displayEffect();
  }

  load(id: string) {
    this.api.earthThing(id, ApiService.SELECT_THING).subscribe(thing => {
      this.thing = thing;
    }, () => this.notFound = true);
  }
  
}
