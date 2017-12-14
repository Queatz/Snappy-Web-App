import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
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

  load(id: string) {
    this.api.earthThing(id, ApiService.SELECT_THING).subscribe(thing => {
      this.thing = thing;
    }, () => this.notFound = true);
  }

}
