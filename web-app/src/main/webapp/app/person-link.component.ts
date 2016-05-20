import { Component, Input } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
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