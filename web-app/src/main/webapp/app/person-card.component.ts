import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'person-card',
    templateUrl: 'app/person-card.component.html',
    styleUrls: ['app/person-card.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class PersonCardComponent {
    @Input() public person;
}
