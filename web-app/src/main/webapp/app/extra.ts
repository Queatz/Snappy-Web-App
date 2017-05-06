import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Injectable, Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export interface WebTitleProvider {
    getWebTitle(): Observable<string>;
}

@Injectable()
export class WebTitleService {

    private titleSubscriber: Subscription = null;

    constructor(private router: Router, private title: Title) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let component: any = this.router.routerState.snapshot.root.firstChild.component as any;

                if (this.titleSubscriber) {
                    this.titleSubscriber.unsubscribe();
                }

                if (component.prototype.getWebTitle) {
                    this.titleSubscriber = component.prototype.getWebTitle().subscribe((title: string) => {Component
                        this.title.setTitle(title);
                        console.log(title);
                    });
                } else {
                    this.titleSubscriber = null;
                    this.title.setTitle('Village');
                }
            }
        });
    }
}