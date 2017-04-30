declare var $;

import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'add-member',
    templateUrl: './add-member.component.html',
    styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements AfterViewInit {
    @Input() thing;

    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
        $(this.elementRef.nativeElement).find('.modal').modal();
    }
}
