declare var $: any;
declare var moment;
declare var Waves;
declare var TextEncoder, Uint8Array;

import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    public avatar: string;

    private avatars = [
        'girl1',
        'girl2',
        'girl3',
        'girl4',
        'girl5',
        'girl6',
        'girl7',
        'guy1',
        'guy2',
        'guy3',
        'guy4',
        'guy5',
        'guy6',
        'guy7',
    ];

    private chatListener: any;

    constructor(
            private elementRef: ElementRef,
            private localityService: LocalityService,
            private route: ActivatedRoute,
            private chat: ChatService) {
    }

    ngOnInit() {
        this.localityService.get(this.onLocalityFound.bind(this));
        this.topics = this.chat.topics;
        this.chats = this.chat.chats;
        this.active = this.topics[0];

        this.chatListener = this.gotChat.bind(this);
        this.chat.register(this.chatListener);

        this.randomAvatar();

        this.route.params.subscribe(params => {
            if (params['topic']) {
                this.setTopicByName(params['topic']);
            }
        });

        this.chat.events.subscribe(() => {
            this.active = this.chat.getTopicByName(this.active.name);
        });
    }

    setTopicByName(topic: string) {
        this.chooseTopic(this.chat.getTopicByName(topic));
    }

    randomAvatar() {
        this.avatar = this.avatars[Math.floor(Math.random()*this.avatars.length)];
    }

    onLocalityFound(locality: string) {
        this.locality = locality;
    }

    onFileUpload(file: File) {
        let fr = new FileReader();
        fr.onloadend = () => this.sendData(fr.result);
        fr.readAsArrayBuffer(file);
    }

    chooseTopic(topic: any) {
        this.active = topic;
        setTimeout(() => this.scrollChat(), 5);
        this.chat.setActiveTopic(topic);
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

    sendData(data: any) {
        // Get topic as bytes
        let t = new TextEncoder('utf-8').encode(JSON.stringify({
            topic: this.active.name,
            avatar: this.avatar
        }));

        // Add null-byte separator
        let topic = new Uint8Array(t.byteLength + 1);
        topic.set(t);

        // Add file bytes as remainder
        var blob = new Uint8Array(topic.byteLength + data.byteLength);
        blob.set(topic);
        blob.set(new Uint8Array(data), topic.byteLength);

        this.chat.send(blob.buffer);
    }

    sendChat(message: string) {
        this.chat.sendMessage(message, this.active.name, this.avatar);
        this.chat.proxyMessage({
            action: 'message.send',
            data: {
                topic: this.active.name,
                message: message,
                avatar: this.avatar
            }
        });
    }

    gotChat(chat: any) {
        if (chat.action === 'message.send' && chat.data.topic === this.active.name) {
            this.scrollChat();
        }
    }

    scrollChat() {
        setTimeout(() => {
            $(this.elementRef.nativeElement).find('.room-main').stop().animate({
                scrollTop: $(this.elementRef.nativeElement).find('.room-main-chats').height()
            }, 0);
        }, 125);
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});

        let scrollChat = this.scrollChat.bind(this);

        setTimeout(() => scrollChat(), 500);
    }

    ngOnDestroy() {
        this.chat.unregister(this.chatListener);
        $(this.elementRef.nativeElement).find('.tooltipped').tooltip('close');
    }

    topicImg(topic: any) {
        return 'img/topics/' + topic.name.toLowerCase() + '.png';
    }

    ago(date: any) {
        return moment(date).fromNow();
    }
}
