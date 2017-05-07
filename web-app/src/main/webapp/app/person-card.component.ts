import { Component, Input } from '@angular/core';
import util from './util';

@Component({
    selector: 'person-card',
    templateUrl: './person-card.component.html',
    styleUrls: ['./person-card.component.css']
})
export class PersonCardComponent {
    @Input() public person;

    public presence() {
        return util.presence(this.person);
    }
}
