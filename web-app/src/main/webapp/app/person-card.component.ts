import { Component, Input } from '@angular/core';

@Component({
    selector: 'person-card',
    templateUrl: './person-card.component.html',
    styleUrls: ['./person-card.component.css']
})
export class PersonCardComponent {
    @Input() public person;
}
