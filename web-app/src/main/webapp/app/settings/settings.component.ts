import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from '../infor.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    constructor(private inforService: InforService, private router: Router) { }

    ngOnInit() {
    }

    signOut() {
        this.inforService.signOut();
        this.router.navigate(['/']);
    }
}
