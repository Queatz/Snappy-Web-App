import { Component, AfterViewInit } from 'angular2/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, OnActivate } from 'angular2/router';
import { MainComponent } from './main.component';
import { ProfileComponent } from './profile.component';
import { SigninComponent} from "./signin.component";
import { MessagesComponent } from "./messages.component";
import { ProjectsComponent } from "./projects.component";
import { HubsComponent } from "./hubs.component";
import { ClubsComponent } from "./clubs.component";
import { ResourcesComponent } from "./resources.component";
import { PeopleComponent } from "./people.component";
import { SearchComponent } from "./search.component";
import { ProjectComponent } from "./project.component";
import { FeedbackModal } from "./feedback.modal";
import { InforService } from './infor.service';
import { ElementRef } from 'angular2/core';

@Component({
	selector: 'app',
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css'],
	directives: [ROUTER_DIRECTIVES, SigninComponent, FeedbackModal]
})
@RouteConfig([
  { path: '/',              name: 'Main',       component: MainComponent, useAsDefault: true },
  { path: '/:id',           name: 'Profile',    component: ProfileComponent },
  { path: '/messages/:id',  name: 'Messages',   component: MessagesComponent },
  { path: '/hubs',          name: 'Hubs',       component: HubsComponent },
  { path: '/clubs',         name: 'Clubs',      component: ClubsComponent },
  { path: '/projects',      name: 'Projects',   component: ProjectsComponent },
  { path: '/resources',     name: 'Resources',  component: ResourcesComponent },
  { path: '/people',        name: 'People',     component: PeopleComponent },
  { path: '/hubs/:id',      name: 'Hub',        component: ProjectComponent },
  { path: '/clubs/:id',     name: 'Club',       component: ProjectComponent },
  { path: '/projects/:id',  name: 'Project',    component: ProjectComponent },
  { path: '/resources/:id', name: 'Resource',   component: ProjectComponent },
  { path: '/search/:query', name: 'Search',     component: SearchComponent }
])
export class AppComponent implements OnActivate, AfterViewInit {
	constructor(private inforService: InforService, element: ElementRef, private router: Router) {
    	this.element = element.nativeElement;
    }

    ngAfterViewInit() {
    	$(this.element).find('.button-collapse').sideNav({
    	    closeOnClick: true
    	});

    	$('.modal-trigger').leanModal();
    	$('.tooltipped').tooltip({delay: 50});
    }

    userSignined() {
    	if(this.inforService.getInforUser()) {
    		return true;
        } else {
    	    return false;
    	}
    }

    isActive(route) {
        return this.router.isRouteActive(this.router.generate(route));
    }

    pageTitle() {
        return this.inforService.getPageTitle();
    }
}
