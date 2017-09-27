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
        if (thing.kind === 'offer') {
            let url = util.thingUrl(thing.source);
            url.push('offers');
            this.router.navigate(url);
            return;
        }

        this.router.navigate(util.thingUrl(thing));
    }
}
