import {Injectable} from 'angular2/core';

var isFirst = true;
var isModelTrigger = true;

@Injectable()
export class InforService {

    getInforUser() {
        if (typeof this.inforUser == 'undefined') {
            this.localData = JSON.parse(localStorage.getItem('myInfo'));
            if (this.localData) {
                return this.localData;
            } else {
                // redirect to home page??
            }
        } else
            return this.inforUser;
    }
    setInforUser(inforUser) {
        if (inforUser != null) {
            this.inforUser = inforUser;
            localStorage.setItem('myInfo', JSON.stringify(inforUser));
        } else {
            localStorage.setItem('myInfo', null);
        }
    }

    setNewOffer(offer) {
        if (this.updateOffers) {
            this.updateOffers(offer, 2);
        }
    }

    setProfileUpdateOffer(deleteCallback, isProfile) {
        if (isProfile == true) {
            this.updateOffers = deleteCallback;
        }
    }

    getModalTrigger() {
        if (isModelTrigger) {
            isModelTrigger = false;
            return true;
        }
        return false;
    }
}