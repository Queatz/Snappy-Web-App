import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'person-card',
    templateUrl: 'app/person-card.component.html',
    styleUrls: ['app/person-card.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class PersonCardComponent {
    @Input() public person;
}
