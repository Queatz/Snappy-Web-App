declare var $;
declare var moment;
declare var Waves;

import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { LocalityService } from '../locality.service';
import { ChatService } from '../chat.service';
import util from '../util';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

    public topics: any;
    public chats: any;
    public active: any;
    public message: string = '';
    public locality: string = '';
    public isShowingAds: boolean = false;

    private chatListener: any;

    constructor(
            private elementRef: ElementRef,
            private localityService: LocalityService,
            private chat: ChatService) {
    }

    ngOnInit() {
        this.localityService.get(this.onLocalityFound.bind(this));
        this.topics = this.chat.topics;
        this.chats = this.chat.chats;
        this.active = this.topics[0];

        this.chatListener = this.gotChat.bind(this);
        this.chat.register(this.chatListener);
    }

    onLocalityFound(locality: string) {
        this.locality = locality;
    }

    chooseTopic(topic: any) {
        this.active = topic;
        this.topics.find(t => t.name === this.active.name).recent = 0;
        setTimeout(() => this.scrollChat(), 5);
    }

    toggleMobileAds() {
        this.isShowingAds = !this.isShowingAds;
    }

    onAddAd(ad: any) {
        this.chat.sendAdAdd(ad);
        this.chat.proxyMessage({
            action: 'ad.add',
            data: ad
        });
    }

    enterPressedInChat(event: Event) {
        this.sendChat(this.message);
        this.message = '';
        event.preventDefault();
    }

    sendChat(message: string) {
        this.chat.sendMessage(message, this.active.name);
        this.chat.proxyMessage({
            action: 'message.send',
            data: {
                topic: this.active.name,
                message: message
            }
        });
    }

    gotChat(chat: any) {
        if (chat.action === 'message.send' && chat.data.topic === this.active.name) {
            this.scrollChat();
            this.topics.find(t => t.name === this.active.name).recent = 0;
        }
    }

    scrollChat() {
        $(this.elementRef.nativeElement).find('.room-main').stop().animate({
            scrollTop: $(this.elementRef.nativeElement).find('.room-main-chats').height()
        }, 0);
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});

        let scrollChat = this.scrollChat.bind(this);

        setTimeout(() => scrollChat(), 500);
    }

    ngOnDestroy() {
        this.chat.unregister(this.chatListener);
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
    }

    ago(date: any) {
        return moment(date).fromNow();
    }
}
