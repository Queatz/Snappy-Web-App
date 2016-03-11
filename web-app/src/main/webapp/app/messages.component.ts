import { Component, ElementRef, provide, AfterViewInit, OnInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router, OnDeactivate } from 'angular2/router';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';

import {InforService} from './infor.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');
var endMessage = false;
var max_count = 10;
var current_count = 0;

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}

@Component({
    templateUrl: 'app/messages.component.html',
    styleUrls: ['app/messages.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, { useClass: MyOptions })],
    directives: [ROUTER_DIRECTIVES]
})
export class MessagesComponent implements AfterViewInit, OnInit, OnDeactivate {
    public currentMessages = [];
    public messageWithSomeone = [];
    public contacts = [];
    public info = [];
    public idCurrentContact;

    constructor(inforService: InforService, private router: Router, private routeParams: RouteParams, http: Http, element: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.element = element.nativeElement;
        this.idCurrentContact = this.routeParams.get('id');
        this.time = 500;
        this.sendId = '';

        if (this.inforService.getInforUser()) {
            this.myId = this.inforService.getInforUser().id;
            this.token = this.inforService.getInforUser().auth;
            this.getUserInfoChatWith();
            this.loadMessages();
        }
    }

    getUserInfoChatWith() {
        if (this.idCurrentContact !== undefined && this.idCurrentContact !== '') {
            this.http.get('http://queatz-snappy.appspot.com/api/people/' + this.idCurrentContact + '?auth=' + this.token)
                .map((res: Response) => res.json())
                .subscribe(dataInput => {
                    if (dataInput) {
                        this.namechater = dataInput.firstName + ' ' + dataInput.lastName;
                    }
                });
        }
    }

    loadMessages() {
        this.http.get('http://queatz-snappy.appspot.com/api/messages' + '?auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(dataInput => {
                this.showMessages(dataInput);
            });
    }

    showMessages(dataInput) {
        this.currentMessages = dataInput.messages;
        var items = [];
        for (var i = 0; i < this.currentMessages.length; i++) {
            var item = "";
            if (this.currentMessages[i].from.id != this.myId)
                item = this.currentMessages[i].from.firstName;
            else if (this.currentMessages[i].to.id != this.myId)
                item = this.currentMessages[i].to.firstName;
            if ($.inArray(item, items) == -1) {
                items.push(item);
                this.contacts.push(this.currentMessages[i]);
            }
        }
        if (this.contacts.length > 0) {
            if (this.idCurrentContact != '') {
                this.goToGetMessages();
            } else {
                this.getMessagesById(this.contacts[0]);
            }
        }
    }

    getMessagesById(contact) {
        //        this.resetTimeInterval();
        this.messageWithSomeone = [];
        if (contact.from.id != this.myId)
            this.idCurrentContact = contact.from.id;
        else
            this.idCurrentContact = contact.to.id;
        this.getUserInfoChatWith();
        this.goToGetMessages();
    }


    goToGetMessages() {
        if (this.idCurrentContact !== '') {
            this.http.get('http://queatz-snappy.appspot.com/api/people/' + this.idCurrentContact + '/messages?auth=' + this.token)
                .map((res: Response) => res.json())
                .subscribe(dataInput => {
                    $('.ms-toogle').toggleClass('ms-toogle-on');
                    if (dataInput.error) {
                        this.messageWithSomeone = [];
                        this.endMessage = false;
                    } else {
                        if (dataInput.length > 0) {
                            if (this.idCurrentContact == dataInput[0].from.id || this.idCurrentContact == dataInput[0].to.id) {
                                if (this.messageWithSomeone.length == 0) {
                                    this.endMessage = false;
                                    this.messageWithSomeone = dataInput.reverse();
                                    this.sendId = dataInput[0].id;
                                } else {
                                    if (this.messageWithSomeone.length >= dataInput.length) {
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
                    }
                    setTimeout(() => {
                        this.goToGetMessages();
                    }, 3000); // TODO exponential backoff
                });
        } else {
            setTimeout(() => {
                this.goToGetMessages();
            }, 1000);
        }
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
        if (this.inforService.getInforUser()) {
            return true;
        }
        return false;
    }

    ngOnInit() {
        /*if (this.inforService.getInforUser()) {
            //this.openInterval();
            this.goToGetMessages();
        }*/
    }

    routerOnDeactivate() {
        clearInterval(this.timer);
    }

    ngAfterViewInit() {
        $('.scroll').niceScroll({
            cursorcolor: "rgb(158, 158, 158)",
            scrollspeed: 0,
        });
    }

    resetTimeInterval() {
        clearInterval(this.timer);
        this.time = 500;
        current_count = 0;
        max_count = 10;
    }

    sendMessages(message) {
        //this.resetTimeInterval();
        if (this.idCurrentContact && message !== undefined && message != "") {
            var creds = "auth=" + this.token + "&message=" + message;
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            this.http.post('http://queatz-snappy.appspot.com/api/people/' + this.idCurrentContact, creds, {
                headers: headers
            })
                .map(res => res.json())
                .subscribe(dataInput => {
                    if (dataInput.message == message) {
                        this.endMessage = false;
                        this.strMessage = '';
                        this.sendId = dataInput.id;
                        this.messageWithSomeone.push(dataInput);

                        //this.openInterval();
                        //this.goToGetMessages(true);
                    }
                });
        } else {
            console.log("empty input or idcontact");
        }
    }

    showContactImage(contact, mode) {
        if (contact.from.id === this.myId) {
            switch (mode) {
                case 0: //imageUrl
                    return contact.to.imageUrl;
                case 1: // name
                    return contact.to.firstName + ' ' + contact.to.lastName;
                default:
                    return '';
            }
        } else {
            switch (mode) {
                case 0: //imageUrl
                    return contact.from.imageUrl;
                case 1: // name
                    return contact.from.firstName + ' ' + contact.from.lastName;
                default:
                    return '';
            }
        }
    }

    checkIsLeft(message) {
        if (message.from.id !== this.myId) {
            this.showleft = true;
            return true;
        } else {
            this.showleft = false;
            return false;
        }
    }

    showContentMessage(message, mode) {
        if (this.messageWithSomeone.indexOf(message) == (this.messageWithSomeone.length - 1) && !this.endMessage) {
            $('.content').animate({ scrollTop: $('.scrollpanel').height() }, 0);
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

    getNameChatter() {
        return this.namechater;
    }

    showChat() {
        $('.ms-toogle').toggleClass('ms-toogle-on');
    }

    showRecent() {
        $('.ms-toogle').toggleClass('ms-toogle-on');
    }
}
