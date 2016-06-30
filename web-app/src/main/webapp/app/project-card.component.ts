import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ApiService } from './api.service';

@Component({
    selector: 'project-card',
    templateUrl: 'app/project-card.component.html',
    styleUrls: ['app/project-card.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectCardComponent implements OnInit {
    @Input() public typeClass;
    @Input() public thing;

    constructor(private api: ApiService, private router: Router) {
    }

    ngOnInit() {
        if (!this.typeClass) {
            switch (this.thing.kind) {
                case 'resource':
                    this.typeClass = 'brown';
                    break;
                case 'project':
                    this.typeClass = 'deep-orange';
                    break;
                case 'hub':
                    this.typeClass = 'blue';
                    break;
                case 'club':
                    this.typeClass = 'yellow darken-4';
                    break;
            }
        }
    }

    public getPhotoUrl() {
        if (this.thing && this.thing.photo) {
            return this.api.earthPhotoUrl(this.thing.id);
        }
    }

    public go() {
        if (!this.thing) {
            return;
        }

        this.router.navigate(['/' + this.thing.kind + 's/' + this.thing.id]);
    }
}
