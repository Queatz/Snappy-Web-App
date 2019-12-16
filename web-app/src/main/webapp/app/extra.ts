import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LocalityService } from './locality.service';
import { mergeMap, map } from 'rxjs/operators';

export interface WebTitleProvider {
    getWebTitle(): Observable<string>;
}

@Injectable()
export class WebTitleService {

    private titleSubscriber: Subscription = null;

    constructor(private title: Title, private locality: LocalityService) {
    }

    public setComponent(component: any) {
        if (this.titleSubscriber) {
            this.titleSubscriber.unsubscribe();
        }

        if (component.getWebTitle) {
            this.titleSubscriber = component.getWebTitle().pipe(
                mergeMap(title => this.locality.observe().pipe(
                    map(locality => `${locality} ${title}`)
                ))
            ).subscribe((title: string) => {
                this.title.setTitle(title);
            });
        } else {
            this.titleSubscriber = this.locality.observe().subscribe(locality => {
                this.title.setTitle(`${locality} Village`);
            });
        }
    }
}
