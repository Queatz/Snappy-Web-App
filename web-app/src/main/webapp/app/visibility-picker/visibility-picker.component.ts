import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { InforService } from '../infor.service';

@Component({
  selector: 'visibility-picker',
  templateUrl: './visibility-picker.component.html',
  styleUrls: ['./visibility-picker.component.css']
})
export class VisibilityPickerComponent implements OnInit {

    @Input() public: boolean;
    @Input() clubs: any;
    @Output() publicChange = new EventEmitter<boolean>();

    public description: string;
    public name: string;

    constructor(private inforService: InforService) { }

    publicChanged() {
        this.publicChange.emit(this.public);
    }

    ngOnInit() {

    }

    clubsList() {
        return this.inforService.myClubs();
    }
}
