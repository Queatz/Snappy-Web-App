import { Component, ElementRef, provide, AfterViewInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router, OnActivate, OnDeactivate } from 'angular2/router';

import {InforService} from './infor.service';
import {ApiService} from './api.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

var endMessage = false;
var max_count = 10;
var current_count = 0;

@Component({
    templateUrl: 'app/messages.component.html',
    styleUrls: ['app/messages.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class MessagesComponent implements AfterViewInit, OnActivate, OnDeactivate {
    public currentMessages = [];
    public messageWithSomeone = null;
    public contacts = null;
    public info = [];
    public idCurrentContact;
    public messagesWith = {};
    public msToggleOn = true;

    constructor(private inforService: InforService, private api: ApiService, private router: Router, private routeParams: RouteParams, element: ElementRef) {
        this.element = element.nativeElement;
        this.time = 5000;
        this.sendId = '';

        if (this.inforService.getInforUser()) {
            this.myId = this.inforService.getInforUser().id;
            this.token = this.inforService.getInforUser().auth;

            this.idCurrentContact = this.routeParams.get('id');
            this.getUserInfoChatWith(this.idCurrentContact);
            this.loadMessages();
        }
    }

    getUserInfoChatWith(personId) {
        if (!personId) {
            return;
        }

        this.api.getPerson(personId)
            .subscribe(dataInput => {
                if (dataInput) {
                    this.messagesWith = dataInput;
                }
            });
    }

    loadMessages() {
        this.api.messages()
            .subscribe(dataInput => {
                this.showMessages(dataInput);
            });
    }

    showMessages(dataInput) {
        this.currentMessages = dataInput.messages;
        this.contacts = _.sortBy(dataInput.contacts, contact => -moment(contact.updated));

        if (this.contacts.length > 0) {
            if (this.idCurrentContact) {
                this.goToGetMessages();
            } else {
                this.getMessagesById(this.contacts[0]);
            }
        }
    }

    getMessagesById(contact) {
        this.msToggleOn = true;

        if (!contact.seen) {
            contact.seen = true;
            this.api.setSeen(contact.contact.id);
        }

        this.resetTimeInterval();
        this.messageWithSomeone = null;
        this.idCurrentContact = contact.contact.id;

        this.messagesWith = contact.contact;
        this.goToGetMessages();
    }

    goToGetMessages() {
        if (!this.idCurrentContact) {
            return;
        }

        if (this.messagesTimeout) {
            clearTimeout(this.messagesTimeout);
            this.messagesTimeout = null;
        }

        this.api.personMessages(this.idCurrentContact)
            .subscribe(dataInput => {
                if (dataInput.error) {
                    this.messageWithSomeone = null;
                    this.endMessage = false;
                } else {
                    if (dataInput.length > 0) {
                        if (this.idCurrentContact == dataInput[0].from.id || this.idCurrentContact == dataInput[0].to.id) {
                            if (!this.messageWithSomeone) {
                                this.endMessage = false;
                                this.messageWithSomeone = dataInput.reverse();
                                this.sendId = dataInput[0].id;
                            } else if (this.messageWithSomeone.length >= dataInput.length) {
                                    if (dataInput[0].id != this.messageWithSomeone[this.messageWithSomeone.length - 1].id &&
                                        this.haveIdInDataInput(dataInput)) {

                                        this.endMessage = false;
                                        this.messageWithSomeone = dataInput.reverse();
                                    }
                            } else {
                                this.endMessage = false;
                                this.messageWithSomeone = dataInput.reverse();
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

    routerOnDeactivate() {
        if (this.messagesTimeout) {
            clearTimeout(this.messagesTimeout);
        }
    }

    ngAfterViewInit() {
        $(this.element).find('.scroll').niceScroll({
            cursorcolor: "rgb(158, 158, 158)",
            scrollspeed: 0,
        });
    }

    private resetTimeInterval() {
        this.time = 5000;
    }

    sendMessages(message) {
        this.resetTimeInterval();

        if (this.idCurrentContact && message) {
            this.api.sendMessage(this.idCurrentContact, message)
                .subscribe(dataInput => {
                    if (dataInput.message === message) {
                        this.endMessage = false;
                        this.strMessage = '';
                        this.sendId = dataInput.id;

                        if (!this.messageWithSomeone) {
                            this.messageWithSomeone = [];
                        }

                        this.messageWithSomeone.push(dataInput);
                    }
                });
        } else {
            console.log("empty input or idcontact");
        }
    }

    showContactImage(contact, mode) {
        switch (mode) {
            case 0: //imageUrl
                return contact.contact.imageUrl;
            case 1: // name
                return contact.contact.firstName + ' ' + contact.contact.lastName;
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

    routerOnActivate() {
        this.inforService.setPageTitle('Messages');
    }
}
