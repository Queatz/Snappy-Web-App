import { Component, OnInit } from '@angular/core';
import { InforService } from '../infor.service';
import { LocalityService } from '../locality.service';

@Component({
  selector: 'intro-card',
  templateUrl: './intro-card.component.html',
  styleUrls: ['./intro-card.component.css']
})
export class IntroCardComponent implements OnInit {

    public locality: string;
    public bkgPosition: number;

    constructor(private inforService: InforService,
        private localityService: LocalityService) { }

    ngOnInit() {
        this.localityService.get(locality => {
            this.locality = locality;
        });

        this.bkgPosition = Math.round(Math.random() * 100);
    }

    public isAuthenticated() {
        return !!this.inforService.getInforUser();
    }

}
