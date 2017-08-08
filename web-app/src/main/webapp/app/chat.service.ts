import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class ChatService {

    private ws: WebSocket = null;
    private queue = [];
    private listeners: Set<any> = new Set();

    public topics: any = [
        {
            name: 'Community',
            recent: 0,
            ads: [
                {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }
            ]
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
            recent: 12,
        },
        {
            name: 'Recruiting',
            recent: 0,
            ads: [
                {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }, {
                    name: 'New chocolate butter!',
                    description: 'You\'ll love our chocolate butter! PLEASE reply to get some for free - only today!'
                }
            ]
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
            recent: 1,
        },
        {
            name: 'Tech',
            recent: 0,
        },
        {
            name: 'Trade',
            recent: 3,
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
            recent: 2,
        },
        {
            name: 'Housework',
            recent: 5,
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
            recent: 8,
        },
        {
            name: 'Modeling',
            recent: 0,
        },
        {
            name: 'Film',
            recent: 1,
        }
    ];

    public chats: any = {};

    constructor(private api: ApiService) {}

    public send(message: string, topic: string) {
        let chat = this.make('send', {
            message: message,
            topic: topic
        });

        if (this.sok().readyState === WebSocket.OPEN) {
            this.sok().send(chat);
        } else {
            this.queue.push(message);
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
        console.log('got chat', chat);

        switch (chat.action) {
            case 'message.got':
                if (!this.chats[chat.data.topic]) {
                    this.chats[chat.data.topic] = [];
                }

                this.chats[chat.data.topic].push({
                    message: chat.data.message
                });
                break;
        }

        for (let listener in this.listeners) {
            this.listeners[listener](chat);
        }
    }

    private onMessage(message: string) {
        let chat = JSON.parse(message);
        this.proxyMessage(chat);
    }

    public register(listener: any) {
        this.listeners.add(listener);
    }

    public unregister(listener: any) {
        this.listeners.delete(listener);
    }

    private onOpen() {
        this.ws.send(this.make('session.start', null));
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
}