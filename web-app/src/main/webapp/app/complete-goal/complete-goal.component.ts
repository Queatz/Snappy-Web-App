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
    this.api.earthThing(id, 'message,token,data,type,role,date,firstName,hidden,lastName,googleUrl,imageUrl,name,photo,liked,likers,likes(source(firstName,lastName,imageUrl,googleUrl)),in(target(name,photo,firstName,lastName,imageUrl,googleUrl)),joins(source(name,firstName,lastName,photo,imageUrl,googleUrl)),about,target(firstName,lastName,googleUrl,imageUrl,around,infoDistance),source(imageUrl,googleUrl,firstName,lastName),members(source(about,date,source(name,firstName,lastName,imageUrl,googleUrl))),clubs(name)').subscribe(thing => {
      this.thing = thing;
    }, () => this.notFound = true);
  }
  
}
