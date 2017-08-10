declare var $;
declare var Waves;

import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { LocalityService } from '../locality.service';
import { ChatService } from '../chat.service';

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
        this.scrollChat();
    }

    toggleMobileAds() {
        this.isShowingAds = !this.isShowingAds;
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
        }
    }

    scrollChat() {
        $(this.elementRef.nativeElement).find('.room-main').animate({
            scrollTop: $(this.elementRef.nativeElement).find('.room-main-chats').height()
        }, 500);
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
}
