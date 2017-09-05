import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import util from './util';

@Component({
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
})
export class SearchComponent {
    constructor(private inforService: InforService, private router: Router) {}

    onSearchResultClicked(thing: any) {
        this.router.navigate(util.thingUrl(thing));
    }
}
