import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';

@Component({
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

    constructor(private api: ApiService, private inforService: InforService, private router: Router) {
        let self = this;
        window.addEventListener('message', event => {
            if (event.data !== 'com.vlllage.message.hey') {
                return;
            }

            let user = self.inforService.getInforUser();
            let referrer = document.referrer.split('/')[2];

            if (!user || !referrer) {
                event.source.postMessage({
                    me: null
                }, event.origin);

                return;
            }

            this.api.getAppToken(referrer).subscribe(result => {
                event.source.postMessage({
                    me: {
                        firstName: user.firstName,
                        id: user.id,
                        token: result.token
                    }
                }, event.origin);
            });
        }, false);
    }

    ngOnInit() {
    }
}