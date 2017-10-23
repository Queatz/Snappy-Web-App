declare var moment: any;

import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { LocalityService } from './locality.service';
import util from './util';

@Injectable()
export class ChatService {

    private ws: WebSocket = null;
    private queue = [];
    private listeners: Set<any> = new Set();
    private activeTopic: any;
    public events: EventEmitter<string> = new EventEmitter();

    public topics: any;
    public chats: any;

    constructor(private api: ApiService, private locality: LocalityService) {
        this.topics = [];
        this.chats = {};
        this.zero();
    }

    private zero() {
        this.topics.length = 0;

        [
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
        ].forEach(topic => this.topics.push(topic));

        for (var key in this.chats) {
            delete this.chats[key];
        }

        if (this.activeTopic) {
            this.activeTopic = this.getTopicByName(this.activeTopic.name);
        } else {
            this.activeTopic = this.topics[0];
        }

        this.events.emit('zero');
    }

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

                let topic = this.getTopicByName(chat.data.topic);

                if (this.activeTopic && this.activeTopic.name === chat.data.topic) {
                    this.setSeen(this.activeTopic.name);
                } else {
                    if (this.isNew(chat.data)) {
                        topic.recent++;
                    }
                }

                break; }
            case 'ad.add': {
                let topic = this.getTopicByName(chat.data.topic);
                topic.ads.unshift(chat.data);

                break; }
            case 'session.start': {
                this.zero();
                chat.data.replay.forEach(replay => this.proxyMessage(replay));
                break; }
            default:
                console.log('Got unknown chat', chat);
        }

        this.listeners.forEach(l => l(chat));
    }

    public getTopicByName(topicName: string) {
        let topic = this.topics.find(t => t.name === topicName);

        if (!topic) {
            topic = {
                name: topicName,
                recent: 0,
                ads: []
            };

            this.topics.push(topic);
        }

        if (topic.ads === undefined) {
            topic.ads = [];
        }

        return topic;
    }

    private onMessage(message: string) {
        let chat = JSON.parse(message);
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

    public setActiveTopic(topic: any) {
        topic.recent = 0;
        this.setSeen(topic.name);
        this.activeTopic = topic;
    }

    private setSeen(topic: string) {
        localStorage.setItem('chat.topic.seen[' + topic + ']', moment().toISOString());
    }

    private isNew(chat: any) {
        let date = localStorage.getItem('chat.topic.seen[' + chat.topic + ']');

        if (!date) {
            return true;
        }

        return moment(date).isBefore(moment(chat.date));
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