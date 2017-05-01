declare var _;
declare var moment;
declare var $;

import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SigninRequiredModal } from './signin-required.modal';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import util from './util';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

var endMessage = false;
var max_count = 10;
var current_count = 0;

@Component({
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements AfterViewInit, OnDestroy {
    public currentMessages = [];
    public messageWithSomeone = null;
    public contacts = null;
    public info = [];
    public idCurrentContact;
    public messagesWith: any = {};
    public msToggleOn = true;

    private element;
    private sendId;
    private strMessage;
    private myId;
    private messagesTimeout;
    private time;
    private endMessage;
    private token;

    constructor(private inforService: InforService, private api: ApiService, private router: Router, private route: ActivatedRoute, element: ElementRef) {
        this.element = element.nativeElement;
        this.time = 5000;
        this.sendId = '';
        this.strMessage = '';

        if (this.inforService.getInforUser()) {
            this.myId = this.inforService.getInforUser().id;
            this.token = this.inforService.getInforUser().auth;

            route.queryParams
                .subscribe((params: Object) => {
                    if (params['q']) {
                        this.strMessage = decodeURIComponent(params['q']);
                    }
                });

            route.params.subscribe(params => {
                this.idCurrentContact = params['id'];
            })

            this.getUserInfoChatWith(this.idCurrentContact);
            this.loadMessages();
        }
    }

    getUserInfoChatWith(personId) {
        if (!personId) {
            return;
        }

        this.api.getPerson(personId)
            .subscribe(person => {
                if (person) {
                    this.messagesWith = person;
                    this.setBkg(this.messagesWith);
                }
            });
    }

    loadMessages() {
        this.api.messages()
            .subscribe(messagesAndContacts => {
                this.showMessages(messagesAndContacts);
            });
    }

    sortedMessages(messages) {
        return _.sortBy(messages, message => moment(message.date));
    }

    showMessages(messagesAndContacts) {
        this.currentMessages = this.sortedMessages(messagesAndContacts.messages);
        this.contacts = _.sortBy(messagesAndContacts.contacts, contact => -moment(contact.updated));

        if (this.contacts.length > 0) {
            if (this.idCurrentContact) {
                this.goToGetMessages();
            } else {
                this.getMessagesById(this.contacts[0]);
            }
        } else {
            this.messageWithSomeone = [];
        }
    }

    getMessagesById(contact) {
        this.msToggleOn = true;

        if (!contact.seen) {
            contact.seen = true;
            this.api.setSeen(contact.target.id);
        }

        this.resetTimeInterval();
        this.messageWithSomeone = null;
        this.idCurrentContact = contact.target.id;

        this.messagesWith = contact.target;
        this.goToGetMessages();
    }

    goToGetMessages() {
        if (!this.idCurrentContact) {
            return;
        }

        if (this.messagesWith) {
            this.setBkg(this.messagesWith);
        }

        if (this.messagesTimeout) {
            clearTimeout(this.messagesTimeout);
            this.messagesTimeout = null;
        }

        this.api.personMessages(this.idCurrentContact)
            .subscribe(messages => {
                if (messages.error) {
                    this.messageWithSomeone = null;
                    this.endMessage = false;
                } else {
                    messages = this.sortedMessages(messages);

                    if (!messages.length) {
                        this.messageWithSomeone = messages;
                    } else {
                        if (this.idCurrentContact == messages[0].from.id || this.idCurrentContact == messages[0].to.id) {
                            if (!this.messageWithSomeone) {
                                this.endMessage = false;
                                this.messageWithSomeone = messages;
                                this.sendId = messages[0].id;
                            } else if (this.messageWithSomeone.length >= messages.length) {
                                    if (messages[0].id != this.messageWithSomeone[this.messageWithSomeone.length - 1].id &&
                                        this.haveIdInDataInput(messages)) {

                                        this.endMessage = false;
                                        this.messageWithSomeone = messages;
                                    }
                            } else {
                                this.endMessage = false;
                                this.messageWithSomeone = messages;
                            }
                        }
                    }
                }

                this.messagesTimeout = setTimeout(() => {
                    this.goToGetMessages();
                }, this.time);

                this.time = Math.min(30000, this.time + 500);
            });
    }

    private setBkg(person: any) {
        $(this.element).find('.content').css({
            'background-image': 'url(\'' + util.imageUrl(this.messagesWith.imageUrl, 640) + '\')',
            'background-color': '#bbbbbb'
        });
    }

    public enterPressed(event) {
        this.sendMessages(this.strMessage);

        event.preventDefault();
    }

    haveIdInDataInput(data) {
        if (this.sendId) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == this.sendId) return true;
            }
        }
        return false;
    }

    haveUserInfor() {
        return !!this.inforService.getInforUser();
    }

    private resetTimeInterval() {
        this.time = 5000;
    }

    ngAfterViewInit() {
        this.inforService.setPageTitle('Messages');
        let signinModal = $(this.element).find('signin-required-modal .modal');

        if (signinModal.length) {
            signinModal.modal('open');
        }

        $(this.element).find('.tooltipped').tooltip({delay: 50});
    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');

        if (this.messagesTimeout) {
            clearTimeout(this.messagesTimeout);
        }
    }

    sendMessages(message) {
        this.resetTimeInterval();

        if (this.idCurrentContact && message) {
            this.api.sendMessage(this.idCurrentContact, message)
                .subscribe(newMessage => {
                    if (newMessage.message === message) {
                        this.endMessage = false;
                        this.strMessage = '';
                        this.sendId = newMessage.id;

                        if (!this.messageWithSomeone) {
                            this.messageWithSomeone = [];
                        }

                        this.messageWithSomeone.push(newMessage);
                    }
                });
        }
    }

    showContactImage(contact, mode) {
        switch (mode) {
            case 0: //imageUrl
                return contact.target.imageUrl;
            case 1: // name
                return contact.target.firstName + ' ' + contact.target.lastName;
            default:
                return '';
        }
    }

    checkIsLeft(message) {
        return message.from.id !== this.myId;
    }

    showContentMessage(message, mode) {
        if (this.messageWithSomeone && this.messageWithSomeone.indexOf(message) === (this.messageWithSomeone.length - 1) && !this.endMessage) {
            $(this.element).find('.content').animate({ scrollTop: $(this.element).find('.scrollpanel').height() }, 0);
            this.endMessage = true;
        }

        switch (mode) {
            case 0: //show message
                return message.message;
            case 1: //show image
                return message.from.imageUrl;
            case 2:
                return message.from.googleUrl;
            default:
                return '';
        }
    }

    showChat() {
        this.msToggleOn = true;
    }

    showRecent() {
        this.msToggleOn = false;
    }
}
