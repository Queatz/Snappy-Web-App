import { Component, Input } from '@angular/core';

@Component({
    selector: 'person-card',
    templateUrl: 'app/person-card.component.html',
    styleUrls: ['app/person-card.component.css']
})
export class PersonCardComponent {
    @Input() public person;
}
