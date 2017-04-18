import { Component, Input } from '@angular/core';

@Component({
    selector: 'add-member',
    templateUrl: 'app/add-member.component.html',
    styleUrls: ['app/add-member.component.css'],
})
export class AddMemberComponent {
    @Input() thing;
}
