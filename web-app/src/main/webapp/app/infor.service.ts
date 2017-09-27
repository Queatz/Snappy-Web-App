declare var gapi;

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

    myClubs() {
        if (this.inforUser) {
            return this.inforUser.clubs;
        }

        return null;
    }

    getLocation(callback: any) {
        navigator.geolocation.getCurrentPosition(callback, this.noLocation);
    }

    noLocation() {
        alert('Village was unable to access your current location.  Some things may not work properly.');
    }

    addClub(club: any) {
        if (this.inforUser) {
            return this.inforUser.clubs.push(club);
        }
    }

    setInforUser(inforUser) {
        if (inforUser) {
            this.inforUser = inforUser;
            localStorage.setItem('myInfo', JSON.stringify(inforUser));
        } else {
            localStorage.removeItem('myInfo');
        }
    }

    signOut() {
        this.localData = undefined;
        this.inforUser = undefined;
        this.setInforUser(null);
        gapi.auth2.getAuthInstance().signOut();
    }

    setSubscribedTo(locality: string, subscribe: boolean) {
        localStorage.setItem('subscribedTo--' + locality, JSON.stringify(subscribe));
    }

    getSubscribedTo(locality: string) {
        return JSON.parse(localStorage.getItem('subscribedTo--' + locality));
    }
}