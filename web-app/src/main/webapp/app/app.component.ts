declare var $;
declare var _;

import { Component, ElementRef, ViewContainerRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';
import { UiService } from './ui.service';

import { map, filter, mergeMap } from 'rxjs/operators';
import { LocalityService } from './locality.service';

@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
	constructor(private inforService: InforService,
            element: ElementRef,
            public view: ViewContainerRef,
            public locality: LocalityService,
            private router: Router,
            private route: ActivatedRoute,
            public tutorial: TutorialService,
            private title: Title,
            private ui: UiService) {
    	this.element = element.nativeElement;
    	this.ui.registerAppComponent(this);
    }

    public isSolo = false;
    private element;
    public localityName;

    ngOnInit() {
    	this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.route),
                map(route => {
                    while (route.firstChild) route = route.firstChild;
                    return route;
                  }),
                mergeMap(route => route.data)
        ).subscribe(data => this.isSolo = data.solo);

        this.locality.get(result => this.localityName = result);
    }

    ngAfterViewInit() {
    	let element = $(this.element);

    	element.find('.sidenav').sideNav();

    	element.find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});

// Uncomment to re-enable welcome modal
//    	if (!this.userSignined()) {
//    	    element.find('#welcomeModal').modal('open');
//    	}
    }

    ngOnDestroy() {
        let element = $(this.element);
        element.find('.tooltipped').tooltip('remove');
    }

    userSignined() {
    	if(this.inforService.getInforUser()) {
    		return true;
        } else {
    	    return false;
    	}
    }

    signIn() {
        this.tutorial.set('profile is here');
        $(this.element).find('signin .abcRioButtonIcon').click();
    }

    menuTapped() {
        switch(this.tutorial.get()) {
            case 'solve some':
                this.tutorial.set('solve some more');
                break;
            default:
                if (this.tutorial.get()) {
                    this.tutorial.set('');
                }

                break;
        }
    }

    startOver() {
        this.tutorial.set(null);
        $(this.element).find('#welcomeModal').modal('open');
    }

    isActive(route) {
        return _.startsWith(this.router.url, route);
    }

    pageTitle() {
        return this.title.getTitle();
    }
}
