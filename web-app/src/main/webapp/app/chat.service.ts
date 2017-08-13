import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LocalityService } from './locality.service';
import util from './util';

@Injectable()
export class ChatService {

    private ws: WebSocket = null;
    private queue = [];
    private listeners: Set<any> = new Set();

    public topics: any = [
        {
            name: 'Community',
            recent: 0,
        },
        {
            name: 'Singles',
            recent: 0,
        },
        {
            name: 'Dating',
            recent: 0,
        },
        {
            name: 'Lunch',
            recent: 0,
        },
        {
            name: 'Gigs',
            recent: 0,
        },
        {
            name: 'Music',
            recent: 0,
        },
        {
            name: 'Art',
            recent: 0,
        },
        {
            name: 'Recruiting',
            recent: 0,
        },
        {
            name: 'Food',
            recent: 0,
        },
        {
            name: 'Tavern',
            recent: 0,
        },
        {
            name: 'News',
            recent: 0,
        },
        {
            name: 'Photography',
            recent: 0,
        },
        {
            name: 'Gaming',
            recent: 0,
        },
        {
            name: 'Tech',
            recent: 0,
        },
        {
            name: 'Trade',
            recent: 0,
        },
        {
            name: 'Events',
            recent: 0,
        },
        {
            name: 'Language',
            recent: 0,
        },
        {
            name: 'Parties',
            recent: 0,
        },
        {
            name: 'Classes',
            recent: 0,
        },
        {
            name: 'Ride Sharing',
            recent: 0,
        },
        {
            name: 'Housework',
            recent: 0,
        },
        {
            name: 'Collab',
            recent: 0,
        },
        {
            name: 'Roommates',
            recent: 0,
        },
        {
            name: 'Anime',
            recent: 0,
        },
        {
            name: 'Modeling',
            recent: 0,
        },
        {
            name: 'Film',
            recent: 0,
        }
    ];

    public chats: any = {};

    constructor(private api: ApiService, private locality: LocalityService) {}

    public start() {
        this.locality.get(this.onStart.bind(this));
    }

    private onStart() {
        if (this.ws) {
            return;
        }

        this.send(this.make('session.start', {
            token: this.getChatToken(),
            location: {
                latitude: this.locality.getPosition().coords.latitude,
                longitude: this.locality.getPosition().coords.longitude
            }
        }));
    }

    public sendMessage(message: string, topic: string, avatar: string) {
        let chat = this.make('message.send', {
            message: message,
            avatar: avatar,
            topic: topic
        });

        this.send(chat);
    }

    public sendAdAdd(ad: any) {
        this.send(this.make('ad.add', ad));
    }

    public send(chat: any) {
        if (this.sok().readyState === WebSocket.OPEN) {
            this.sok().send(chat);
        } else {
            this.queue.push(chat);
        }

        console.log('send chat', chat);
    }

    private make(action: string, data: any) {
        return JSON.stringify({
            action: action,
            data: data
        });
    }

    public proxyMessage(chat: any) {
        switch (chat.action) {
            case 'message.send': {
                if (!this.chats[chat.data.topic]) {
                    this.chats[chat.data.topic] = [];
                }

                this.chats[chat.data.topic].push({
                    message: chat.data.message,
                    avatar: chat.data.avatar,
                    photo: chat.data.photo ? this.api.url(chat.data.photo) : undefined
                });

                let topic = this.topics.find(t => t.name === chat.data.topic);

                if (!topic) {
                    topic = {
                        name: chat.data.topic,
                        recent: 0
                    };

                    this.topics.push(topic);
                }

                topic.recent++;

                break; }
            case 'ad.add': {
                let topic = this.topics.find(t => t.name === chat.data.topic);

                if (!topic.ads) {
                    topic.ads = [];
                }

                topic.ads.unshift(chat.data);

                break; }
            case 'session.start': {
                chat.data.replay.forEach(replay => this.proxyMessage(replay));
                break; }
            default:
                console.log('Got unknown chat', chat);
        }

        this.listeners.forEach(l => l(chat));
    }

    private onMessage(message: string) {
        let chat = JSON.parse(message);
        console.log('got chat', message);
        this.proxyMessage(chat);
    }

    public register(listener: any) {
        this.listeners.add(listener);

        if (!this.ws) {
            this.start();
        }
    }

    public unregister(listener: any) {
        this.listeners.delete(listener);
    }

    private onOpen() {
        while (this.queue.length) {
            this.ws.send(this.queue.shift());
        }
    }

    private onClose() {
        this.ws = null;
    }

    private sok() {
        if (this.ws === null) {
            this.ws = this.api.ws();
            this.ws.onmessage = message => this.onMessage(message.data);
            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onclose = this.onClose.bind(this);
        }

        return this.ws;
    }

    private disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    private getChatToken() {
        let token = localStorage.getItem('chat-token');

        if (token) {
            return token;
        }

        token = util.rndstr(32);
        localStorage.setItem('chat-token', token);

        return token;
    }
}