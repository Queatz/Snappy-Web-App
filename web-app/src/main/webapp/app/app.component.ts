declare var $;
declare var _;

import { Component, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { InforService } from './infor.service';
import { TutorialService } from './tutorial.service';

@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
	constructor(private inforService: InforService,
            element: ElementRef,
            private router: Router,
            private route: ActivatedRoute,
            public tutorial: TutorialService,
            private title: Title) {
    	this.element = element.nativeElement;
    }

    public isSolo = true;
    private element;

    ngOnInit() {
    	this.router.events
                .filter(event => event instanceof NavigationEnd)
                .map(() => this.route)
                .map(route => {
                    while (route.firstChild) route = route.firstChild;
                    return route;
                  })
                .mergeMap(route => route.data)
                .subscribe(data => this.isSolo = data.solo);
    }

    ngAfterViewInit() {
    	let element = $(this.element);

    	element.find('.button-collapse').sideNav({
    	    closeOnClick: true
    	});

    	element.find('.tooltipped').tooltip({delay: 50});

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
