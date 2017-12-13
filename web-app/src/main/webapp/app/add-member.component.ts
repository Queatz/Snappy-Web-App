declare var $;

import { Component, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { InforService } from './infor.service';

@Component({
    selector: 'add-member',
    templateUrl: './add-member.component.html',
    styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements AfterViewInit, OnDestroy {
    @Input() thing;

    constructor(private elementRef: ElementRef, private info: InforService) {}

    ngAfterViewInit() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
        $(this.elementRef.nativeElement).find('.modal').modal();
    }

    ngOnDestroy() {
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }

    isMe() {
        return this.thing && this.info.getInforUser() && this.info.getInforUser().id === this.thing.id;
    }
}
