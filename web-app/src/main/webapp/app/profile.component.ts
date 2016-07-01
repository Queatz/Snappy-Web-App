import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';
import { OffersComponent } from './offers.component';
import { ThingUpdatesComponent } from './thing-updates.component';
import { ParseLinksComponent } from './parseLinks.component';
import { FloatingComponent } from './floating.component';
import { NewOfferModal } from './new-offer.modal';
import { NewProjectModal } from './new-project.modal';
import { NewResourceModal } from './new-resource.modal';
import { NewHubModal } from './new-hub.modal';
import { PostUpdateModal } from './post-update.modal';
import { ApiService } from './api.service';
import { InforService } from './infor.service';
import { ThingsComponent } from './things.component';

@Component({
    templateUrl: 'app/profile.component.html',
    styleUrls: ['app/profile.component.css'],
    directives: [ROUTER_DIRECTIVES, OffersComponent, ParseLinksComponent, FloatingComponent, PostUpdateModal, ThingUpdatesComponent, ThingsComponent],
})
//@RouteConfig([
//  { path: '/',       component: OffersTabComponent, useAsDefault: true },
//  { path: '/updates', component: UpdatesTabComponent },
//])
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
    public notFound = false;
    private offers;
    private myProfile;
    public editAbout;
    public selectedTab = 'offers';

    constructor(
        inforService: InforService,
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        element: ElementRef
    ) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.offers = null;
        this.person = null;

        this.newOfferModal = NewOfferModal;
        this.newResourceModal = NewResourceModal;
        this.newProjectModal = NewProjectModal;
        this.newHubModal = NewHubModal;
        this.postUpdateModal = PostUpdateModal;
    }

    ngOnInit() {
         this.inforService.setPageTitle('Village');

         this.route.params.subscribe(params => {
            let id = params.id;
            let tab = params.tab;

            this.loadPerson(id);
            this.myProfile = id;
        });
    }

    loaded(offers) {
        this.offers = offers;
        setTimeout(this.ngAfterViewInit.bind(this), 500);
    }

    selectTab(tab: String) {
        this.selectedTab = tab;
        // Masonry
        window.dispatchEvent(new Event('resize'));
    }

    loadPerson(personName) {
            this.api.getPersonByName(personName)
            .subscribe(person => {
                this.person = person;
                this.person.updates = _.sortBy(this.person.updates, update => -moment(update.date));
                this.editAbout = person.about;
                this.inforService.setPageTitle(person.firstName);
                this.loaded(person.offers);
            },
            error => this.notFound = true);
    }

    ngAfterViewInit() {
        $(this.element).find('.modal-trigger').leanModal();
        $('.tooltipped').tooltip({delay: 50});

        if (this.inforService.triggerProfile && this.isMyProfile()) {
            this.inforService.triggerProfile = false;
            $(this.element).find('.modal-trigger-floating').leanModal();
       }

       $(this.element).find('ul.tabs').tabs();
    }

    ngOnDestroy() {
        $('.tooltipped').tooltip('remove');
        $('.material-tooltip').remove();
    }

    saveEdit() {
        this.api.saveAbout(this.editAbout).subscribe(() => {
            this.person.about = this.editAbout;
        });
    }

    toggleFollow() {
        if (this.isFollowing) {
            // Show unfollow modal ->
            this.isFollowing = false;
        } else {
            // Follow -> this.isFollowing => true
            this.isFollowing = true;
        }
    }

    isMyProfile() {
        return this.inforService.getInforUser() !== undefined
                && this.myProfile == this.inforService.getInforUser().googleUrl;
    }
}
