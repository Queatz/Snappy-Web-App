import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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

import { FeedbackModal } from './feedback.modal';
import { WelcomeModal } from './welcome.modal';
import { GdayModal } from './gday.modal';
import { NewHubModal } from './new-hub.modal';
import { SetPhotoModal } from './set-photo.modal';
import { EditDetailsModal } from './edit-details.modal';
import { PostUpdateModal } from './post-update.modal';
import { AddContactModal } from './add-contact.modal';
import { RemoveContactModal } from './remove-contact.modal';
import { SigninRequiredModal } from './signin-required.modal';



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

        ParseLinksPipe,

        FeedbackModal,
        WelcomeModal,
        GdayModal,
        NewHubModal,
        SetPhotoModal,
        EditDetailsModal,
        PostUpdateModal,
        AddContactModal,
        RemoveContactModal,
        SigninRequiredModal,
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        InforService,
        ApiService,
        TutorialService,
        {
            provide: RequestOptions,
            useClass: MyOptions
        }
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
