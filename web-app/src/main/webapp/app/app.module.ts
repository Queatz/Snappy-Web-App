import { NgModule, CUSTOM_ELEMENTS_SCHEMA, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpModule, Headers, BaseRequestOptions, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { TutorialService } from './tutorial.service';
import { AppRoutingModule } from './app.routes';

import { FloatingComponent } from './floating.component';
import { ProjectCardComponent } from './project-card.component';
import { SigninComponent } from './signin.component';
import { CueComponent } from './cue.component';
import { BannerComponent } from './banner.component';
import { InfoPanelComponent } from './info-panel.component';
import { OfferCardComponent } from './offer-card.component'
import { OffersComponent } from './offers.component';
import { ThingsComponent } from './things.component';
import { PersonCardComponent } from './person-card.component';
import { MapComponent } from './map.component';
import { PersonLinkComponent } from './person-link.component';
import { ThingUpdatesComponent } from './thing-updates.component';
import { ParseLinksPipe } from './parse-links.pipe';
import { ThingUpdateComponent } from './thing-update.component';
import { MainComponent } from './main.component';
import { MessagesComponent } from './messages.component';

import { ProfileComponent } from './profile.component';
import { ProjectsComponent } from "./projects.component";
import { HubsComponent } from "./hubs.component";
import { ClubsComponent } from "./clubs.component";
import { ResourcesComponent } from "./resources.component";
import { PeopleComponent } from "./people.component";
import { SearchComponent } from "./search.component";
import { ProjectComponent } from "./project.component";

import { FeedbackModal } from './feedback.modal';
import { WelcomeModal } from './welcome.modal';
import { GdayModal } from './gday.modal';
import { NewHubModal } from './new-hub.modal';
import { NewOfferModal } from './new-offer.modal';
import { NewProjectModal } from './new-project.modal';
import { NewResourceModal } from './new-resource.modal';
import { SetPhotoModal } from './set-photo.modal';
import { EditDetailsModal } from './edit-details.modal';
import { PostUpdateModal } from './post-update.modal';
import { AddContactModal } from './add-contact.modal';
import { AddThingModal } from './add-thing.modal';
import { RemoveContactModal } from './remove-contact.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InviteModal } from './invite.modal';

import { ExactRouteReuseStrategy } from './exact.reuse';

enableProdMode();

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    declarations: [
        AppComponent,
        FloatingComponent,
        ProjectCardComponent,
        SigninComponent,
        CueComponent,
        BannerComponent,
        InfoPanelComponent,
        OfferCardComponent,
        OffersComponent,
        ThingsComponent,
        PersonCardComponent,
        MapComponent,
        PersonLinkComponent,
        ThingUpdatesComponent,
        ThingUpdateComponent,
        MainComponent,
        MessagesComponent,

        ProfileComponent,
        ProjectsComponent,
        HubsComponent,
        ClubsComponent,
        ResourcesComponent,
        PeopleComponent,
        SearchComponent,
        ProjectComponent,

        ParseLinksPipe,

        FeedbackModal,
        WelcomeModal,
        GdayModal,
        NewHubModal,
        NewOfferModal,
        SetPhotoModal,
        EditDetailsModal,
        PostUpdateModal,
        AddContactModal,
        RemoveContactModal,
        SigninRequiredModal,
        NewProjectModal,
        NewResourceModal,
        InviteModal,
        AddThingModal,
    ],
    entryComponents: [
        FeedbackModal,
        WelcomeModal,
        GdayModal,
        NewHubModal,
        NewOfferModal,
        SetPhotoModal,
        EditDetailsModal,
        PostUpdateModal,
        AddContactModal,
        RemoveContactModal,
        SigninRequiredModal,
        NewProjectModal,
        NewResourceModal,
        InviteModal,
    ],
    providers: [
        InforService,
        ApiService,
        TutorialService,
        {
            provide: RequestOptions,
            useClass: MyOptions
        },
        {provide: RouteReuseStrategy, useClass: ExactRouteReuseStrategy}
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
