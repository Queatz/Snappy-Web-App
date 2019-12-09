declare var gapi;
declare var $: any;

import { Injectable, ComponentRef } from '@angular/core';
import { InviteModal } from './invite.modal';
import { UiService } from './ui.service';
import { SetLocationModalComponent } from './set-location-modal/set-location-modal.component';

@Injectable()
export class InforService {

    private title = 'Village';

    private inforUser;
    private localData;
    private overrideLocation: any;
    private errorShown: boolean = false;
    private locateModal: ComponentRef<SetLocationModalComponent>;
    private locationCallbacks: Set<any> = new Set();

    constructor(private ui: UiService) {}

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

    myModes() {
        if (this.inforUser) {
            return this.inforUser.modes;
        }

        return null;
    }

    getLocation(callback: any, err: any = null) {
        if (this.overrideLocation) {
            callback(this.overrideLocation);
            return;
        }

        this.locationCallbacks.add(callback);

        navigator.geolocation.getCurrentPosition(location => this.locationFound(callback, location), err !== null ? err : this.noLocation.bind(this));
    }

    private locationFound(callback: any, location: any) {
        this.overrideLocation = location;
        this.locationCallbacks.delete(callback);

        localStorage.setItem('lastKnownPosition', JSON.stringify({
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        }));

        callback(location);
    }

    setLocation(location: any) {
        this.overrideLocation = location;

        localStorage.setItem('lastKnownPosition', JSON.stringify({
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        }));

        this.locationCallbacks.forEach(c => c(this.overrideLocation));
        this.locationCallbacks.clear();
    }

    clearLocation() {
        this.overrideLocation = null;
        localStorage.removeItem('lastKnownPosition');
    }

    noLocation(err: PositionError) {
        if (this.locateModal && !this.locateModal.hostView.destroyed) {
            return;
        }

        let lastKnownPosition = localStorage.getItem('lastKnownPosition');

        if (lastKnownPosition) {
            this.setLocation(JSON.parse(lastKnownPosition));
            return;
        }

        this.locateModal = this.ui.show(SetLocationModalComponent);
        (this.locateModal.instance as SetLocationModalComponent).onLocationSelected.subscribe(
            location => this.setLocation(location)
        );
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