import { Injectable } from '@angular/core';

@Injectable()
export class InforService {

    private title = 'Village';

    private inforUser;
    private localData;

    getInforUser() {
        if (this.inforUser === undefined) {
            this.localData = JSON.parse(localStorage.getItem('myInfo'));
            if (this.localData) {
                return this.localData;
            } else {
                // redirect to home page??
            }
        } else
            return this.inforUser;
    }

    getId() {
        if (this.getInforUser()) {
            return this.getInforUser().id;
        }

        return '';
    }

    setInforUser(inforUser) {
        if (inforUser !== null) {
            this.inforUser = inforUser;
            localStorage.setItem('myInfo', JSON.stringify(inforUser));
        } else {
            localStorage.setItem('myInfo', null);
        }
    }

    // Deprecated, use extra.ts
    setPageTitle(title) {
        this.title = title;
    }

    // Deprecated, use extra.ts
    getPageTitle() {
        return this.title;
    }

    setSubscribedTo(locality: string, subscribe: boolean) {
        localStorage.setItem('subscribedTo--' + locality, JSON.stringify(subscribe));
    }

    getSubscribedTo(locality: string) {
        return JSON.parse(localStorage.getItem('subscribedTo--' + locality));
    }
}