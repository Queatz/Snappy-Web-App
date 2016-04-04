import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'project-card',
    templateUrl: 'app/project-card.component.html',
    styleUrls: ['app/project-card.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectCardComponent {
    @Input() public typeClass;
}
