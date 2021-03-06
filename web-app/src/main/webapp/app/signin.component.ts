declare var gapi;
declare var $: any;

import {Component, AfterViewInit, ElementRef, Inject, OnInit, NgZone} from '@angular/core';
import { Router } from '@angular/router';

import {InforService} from './infor.service';
import {ApiService} from './api.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements AfterViewInit, OnInit {
    private element;

    constructor(
        private inforService: InforService,
        private api: ApiService,
        private _ngZone: NgZone,
        private router: Router,
        elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        var inforService = this.inforService;
        gapi.signin2.render(this.element.querySelector('.google-signin'), {
            width: 120,
            longtitle: false,
            onsuccess: (googleUser) => {
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

    signedIn() {
        return this.inforService.getInforUser();
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

                if (gday) {
                    // Modal is in app.component
                    $('#gdayModal').modal('open');
                }
            });
    }
}
