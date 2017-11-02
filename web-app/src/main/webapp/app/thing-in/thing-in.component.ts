import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import util from '../util';

@Component({
  selector: 'thing-in',
  templateUrl: './thing-in.component.html',
  styleUrls: ['./thing-in.component.css']
})
export class ThingInComponent implements OnInit {

    @Input() public thing: any;
    @Input() public sameKind: boolean = false;
    public isSameKind: any;

    constructor(private api: ApiService) {
        this.isSameKind = this.isSameKindBounded.bind(this);
    }

    ngOnInit() {
    }

    public thingName(thing: any) {
        return util.thingName(thing);
    }

    public goUrlFor(thing: any) {
        if (!thing) {
            return;
        }

        return util.thingUrl(thing);
    }

    public getPhotoUrlFor(thing: any, sz: number) {
        return this.api.getPhotoUrlFor(thing, sz);
    }

    public isSameKindBounded(thing: any) {
        // Preconditions
        if (!thing || !thing.target || thing.target.kind === 'update') {
            return false;
        }

        if (this.thing.source && this.thing.source.id === thing.target.id) {
            return false;
        }

        return !this.sameKind || thing.target.kind === this.thing.kind;
    }
}
