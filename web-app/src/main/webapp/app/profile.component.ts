import { Component, OnInit, ElementRef, provide, AfterViewInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteParams, Router, CanReuse } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { OffersComponent } from './offers.component';
import { ParseLinksComponent } from './parseLinks.component';
import { FloatingComponent } from './floating.component';

import {InforService} from './infor.service';
var checkPFirst = true;
var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
  headers: Headers = firstHeaders
}

@Component({
	templateUrl: 'app/profile.component.html',
	styleUrls: ['app/profile.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})],
	directives: [ROUTER_DIRECTIVES, OffersComponent, ParseLinksComponent,FloatingComponent],
	
})
export class ProfileComponent implements OnInit, AfterViewInit, CanReuse {
    //private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
    private offers;
	private myProfile;
    constructor(
    	inforService: InforService,
        private router:Router,
        private routeParams:RouteParams,
        http: Http,
        element: ElementRef
    ) {
    	this.inforService = inforService;
        this.http = http;
        this.element = element.nativeElement;
        this.offers = null;
        this.person = null;                
    }

	routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { 
		this.isMyProfile(){
			return false; 
		}else{
			return true;
		}
	}
	
    ngOnInit() {
        let id = this.routeParams.get('id');
        if(id != 'messages'){
	        this.loadPerson(id);
	        this.myProfile = id;
        }else{
        	this.router.navigate(['Messages',{id:''}]);
        }
    }

    loaded(offers) {
        this.offers = offers;
    }

    loadPerson(personId) {
        this.http.get('http://queatz-snappy.appspot.com/api/people/by-name/' + personId + '?auth=' + this.inforService.getInforUser().auth)
            .map((res: Response) => res.json())
            .subscribe(person => {
                this.person = person;
                this.loaded(person.offers);                
            });
    }
    ngAfterViewInit() {
  		if (checkPFirst && this.isMyProfile()) {
  			checkPFirst = false;
			$('.modal-trigger-thientt').leanModal();
		}
		
    }
    isMyProfile() {
    	if(this.myProfile == this.inforService.getInforUser().googleUrl){    		
     		return true;
     	}
     	return false;
    }
}
