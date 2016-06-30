import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { InforService } from './infor.service';

@Component({
    selector: 'person-link',
    templateUrl: 'app/person-link.component.html',
    styleUrls: ['app/person-link.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class PersonLinkComponent implements AfterViewInit {
    @Input() person;
}