declare var gapi;
declare var $;

import {Component, AfterViewInit, ElementRef, Inject, OnInit, NgZone} from '@angular/core';
import { Router } from '@angular/router';

import {InforService} from './infor.service';
import {ApiService} from './api.service';

@Component({
    selector: 'signin',
    templateUrl: 'app/signin.component.html',
    styleUrls: ['app/signin.component.css']
})
export class SigninComponent implements AfterViewInit, OnInit {
    public signedIn: boolean;
    private element;

    private localData;
    private glink;
    private gimage;

    constructor(
        private inforService: InforService,
        private api: ApiService,
        private _ngZone: NgZone,
        private router: Router,
        elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
        this.signedIn = !!inforService.getInforUser();
        if (localStorage.getItem('myInfo')) {
            this.localData = JSON.parse(localStorage.getItem('myInfo'));
            if (this.localData) {
                this.glink = this.localData.googleUrl;
                this.gimage = this.localData.imageUrl;
            }
        }
    }

    ngOnInit() {

    }
    ngAfterViewInit() {
        var inforService = this.inforService;
        gapi.signin2.render(this.element.querySelector('.google-signin'), {
            width: 120,
            longtitle: false,
            onsuccess: (googleUser) => {
                this.signedIn = true;
                this.onSuccess(googleUser);
            },
            onfailure: (error) => {
                console.log(error);
            },
            scope: 'profile email',
            redirect_uri: 'postmessage'
        });

        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.getAuthInstance();
            if (auth2) {
                auth2.then(function() {
                    if (!auth2.isSignedIn.get()) {
                        inforService.setInforUser(null);
                    }
                });
            }
        });
    }

    /**
     * save user info if get googleuser success
     */
    public onSuccess(googleUser) {
        var gemail = googleUser.getBasicProfile().getEmail();
        var gtoken = googleUser.getAuthResponse().access_token;

        var gday = !this.inforService.getInforUser();

        this.api.getMe(gemail, gtoken)
            .subscribe(dataInput => {
                this.inforService.setInforUser(dataInput);
                this.glink = dataInput.googleUrl;
                this.gimage = dataInput.imageUrl;

                if (gday) {
                    // Modal is in app.component
                    $('#gdayModal').openModal();
                }
            });
    }
}
