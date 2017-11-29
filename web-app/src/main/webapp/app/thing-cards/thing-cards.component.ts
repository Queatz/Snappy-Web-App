import { Component, Input } from '@angular/core';

@Component({
  selector: 'thing-cards',
  templateUrl: './thing-cards.component.html',
  styleUrls: ['./thing-cards.component.css']
})
export class ThingCardsComponent {

    @Input() things: any[];

    public amount: number = 20;

    constructor() { }
    
    onBottomReached() {
        this.amount += 10;
    }
    
    byId(thing: any) {
        return thing.id;
    }
}
