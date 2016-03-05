import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { MainComponent } from './main.component';
import { ProfileComponent } from './profile.component';
import { SigninComponent} from "./signin.component";
import { MessagesComponent} from "./messages.component";
import {enableProdMode} from 'angular2/core';

import {InforService} from './infor.service';

enableProdMode();

@Component({
	selector: 'app',
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css'],
	directives: [ROUTER_DIRECTIVES, SigninComponent]
})
@RouteConfig([
  { path: '/',          name: 'Main',       component: MainComponent, useAsDefault: true },
  { path: '/:id',       name: 'Profile',    component: ProfileComponent },
  { path: 'messages/:id',  name: 'Messages',    component: MessagesComponent }

])
export class AppComponent {
	 constructor(inforService: InforService) {
    	this.inforService = inforService;
    }

    userSignined () {
    	if(this.inforService.getInforUser()) {
    		return true;
        } else {
    	    return false;
    	}
    }

}
