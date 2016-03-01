import {Injectable} from 'angular2/core';

@Injectable()
export class InforService{	

	getInforUser(){
		if(typeof this.inforUser == 'undefined'){
			this.localData = JSON.parse(localStorage.getItem('myInfo'));
			if(this.localData){
				return this.localData;
			}else{
				window.location.replace('http://localhost:3000');
			}
		}else
			return this.inforUser;
	}
	
	setInforUser(inforUser){
		this.inforUser = inforUser;		
		localStorage.setItem('myInfo',JSON.stringify(inforUser));
	}
	
	setNewOffer(offer){
		if(this.updateOffers){
			this.updateOffers(offer, 2);
		}
	}
	
	setProfileUpdateOffer(deleteCallback, isProfile){
		if(isProfile == true){
			this.updateOffers = deleteCallback;
		}
	}
}