import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
import { ApiService } from './api.service';

@Component({
    templateUrl: 'app/project.component.html',
    styleUrls: ['app/project.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectComponent {
    public thing;
    public notFound = false;

    constructor(private api: ApiService, private routeParams: RouteParams) {
        this.id = this.routeParams.get('id');

        api.earthThing(this.id).subscribe(thing => {
                    this.thing = thing;
                },
                error => this.notFound = true);
    }
}
