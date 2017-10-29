import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from '../infor.service';
import { LocalityService } from '../locality.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    currentLocation: string;

    constructor(private inforService: InforService, private locality: LocalityService, private router: Router) { }

    ngOnInit() {
        this.locality.get(locality => this.currentLocation = locality);
    }

    signOut() {
        this.inforService.signOut();
        this.router.navigate(['/']);
    }

    changeLocation() {
        this.inforService.clearLocation();
        this.inforService.getLocation(() => this.ngOnInit());
    }
}
