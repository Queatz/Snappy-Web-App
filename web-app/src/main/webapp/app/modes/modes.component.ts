import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'modes',
  templateUrl: './modes.component.html',
  styleUrls: ['./modes.component.css']
})
export class ModesComponent implements OnInit {

  public things;

  constructor(private api: ApiService, private inforService: InforService) {
    this.inforService.getLocation(this.loadNearby.bind(this));
  }

  private loadNearby(position) {
      this.api.earthHere(position.coords, 'mode', ApiService.SELECT_THINGS)
          .subscribe(things => {
              this.loaded(things);
          },
          error => {
              this.things = [];
          });
  }

  private loaded(things) {
      this.things = things;
  }

  ngAfterViewInit() {
  }

  public getWebTitle() {
      return Observable.of('Modes');
  }
}
