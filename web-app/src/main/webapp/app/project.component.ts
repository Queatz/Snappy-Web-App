import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';

@Component({
    templateUrl: 'app/project.component.html',
    styleUrls: ['app/project.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectComponent {
    constructor(private routeParams: RouteParams) {
        this.id = this.routeParams.get('id');
    }
}
