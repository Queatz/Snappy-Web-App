import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { ApiService } from './api.service';

@Component({
    selector: 'project-card',
    templateUrl: 'app/project-card.component.html',
    styleUrls: ['app/project-card.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectCardComponent {
    @Input() public typeClass;
    @Input() public thing;

    constructor(private api: ApiService, private router: Router) {
    }

    public getPhotoUrl() {
        if (this.thing && this.thing.photo) {
            return this.api.getPhotoUrl(this.thing.id);
        }
    }

    public go() {
        if (!this.thing) {
            return;
        }

        this.router.navigate([_.capitalize(this.thing.kind), {id: this.thing.id}]);
    }
}
