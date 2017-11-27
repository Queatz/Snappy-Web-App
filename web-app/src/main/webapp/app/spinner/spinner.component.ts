import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnChanges {

    @Input() show: boolean;

    passedDelay: boolean;
    private timeout: any;

    constructor() { }

    ngOnInit() {
        this.reset();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.reset();
    }

    private reset() {
        this.passedDelay = false;

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (this.show) {
            this.timeout = setTimeout(() => this.passedDelay = true, 1125);
        }
    }
}
