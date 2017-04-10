import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Component({
    selector: 'project-card',
    templateUrl: 'app/project-card.component.html',
    styleUrls: ['app/project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
    @Input() public typeClass;
    @Input() public thing;

    constructor(private api: ApiService, private router: Router) {
    }

    ngOnInit() {
        if (this.thing.kind === 'member') {
            this.thing = this.thing.source;
        }

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
                case 'person':
                default:
                    this.typeClass = 'bkg-red';
                    break;
            }
        }

        switch (this.thing.kind) {
            case 'person':
                this.thing.name = this.thing.firstName + ' ' + this.thing.lastName;
        }
    }

    public getPhotoUrl() {
        if (!this.thing) {
            return null;
        }

        switch (this.thing.kind) {
            case 'person':
                return this.thing.imageUrl.split('=')[0] + '=480';
            default:
                if (this.thing.photo) {
                    return this.api.earthPhotoUrl(this.thing.id);
                }
                break;
        }
    }

    public go() {
        if (!this.thing) {
            return;
        }

        switch (this.thing.kind) {
            case 'person':
                this.router.navigate(['/' + this.thing.googleUrl]);
                break;
            default:
                this.router.navigate(['/' + this.thing.kind + 's/' + this.thing.id]);
                break;
        }
    }
}
