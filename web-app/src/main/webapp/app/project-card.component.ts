import { Component, Input } from 'angular2/core';

@Component({
    selector: 'project-card',
    templateUrl: 'app/project-card.component.html',
    styleUrls: ['app/project-card.component.css']
})
export class ProjectCardComponent {
    @Input() public typeClass;
}
