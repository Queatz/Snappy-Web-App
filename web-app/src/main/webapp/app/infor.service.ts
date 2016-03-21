import { Injectable } from 'angular2/core';

var isFirst = true;
var isModelTrigger = true;
var listOfferCheck = {};
var sizeOffer = 0;
var deleteOfferTime = 0;

@Injectable()
export class InforService {

    public deletedSomeItem = false;
    public triggerProfile = true;
    
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

    setInforUser(inforUser) {
        if (inforUser !== null) {
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

    getListOfferCheck(position) {
        if (listOfferCheck[position] === undefined || listOfferCheck[position] == false) {
            listOfferCheck[position] = true;
            return false;
        }
        return true;
    }

    getOfferSize() {
        return sizeOffer;
    }

    setOfferSize(size) {
        if (size !== 0)
            sizeOffer += size;
        else
            sizeOffer += sizeOffer;
    }

    setDeleteOffer(deleteCount) {
        deleteOfferTime += parseInt(deleteCount);
        this.deletedSomeItem = true;
    }

    getDeleteOffer() {
        return deleteOfferTime;
    }
}