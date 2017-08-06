declare var Waves;

import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

    public topics: any = [
        'Community',
        'Singles',
        'Dating',
        'Gigs',
        'Music',
        'Art',
        'Recruiting',
        'Food',
        'Tavern',
        'News',
        'Photography',
        'Gaming',
        'Tech',
        'Trade',
        'Events',
        'Language',
        'Parties',
        'Classes',
        'Rides',
        'Housework',
        'Collab',
        'Roommates',
        'Anime',
        'Modeling',
        'Film'
    ];

    public active: string = 'Community';

    constructor() { }

    ngOnInit() {

    }

    chooseTopic(topic: string) {
        this.active = topic;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }
}
