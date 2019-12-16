import { NgModule, CUSTOM_ELEMENTS_SCHEMA, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { WebTitleService } from './extra';
import { AppComponent } from './app.component';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { TutorialService } from './tutorial.service';
import { LocalityService } from './locality.service';
import { UiService } from './ui.service';
import { ChatService } from './chat.service';
import { WorldService } from './world.service';
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
import { MapComponent } from './map.component';
import { PersonLinkComponent } from './person-link.component';
import { ThingUpdatesComponent } from './thing-updates.component';
import { ParseLinksPipe } from './parse-links.pipe';
import { FilterPipe } from './filter.pipe';
import { ThingUpdateComponent } from './thing-update.component';
import { MainComponent } from './main.component';
import { MessagesComponent } from './messages.component';
import { AddMemberComponent } from './add-member.component';
import { ThingTabsComponent } from './thing-tabs.component';
import { TabsForComponent } from './tabs-for.component';
import { ParseLinksComponent } from './parse-links.component';

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
import { NewFormModal } from './new-form.modal';
import { SetPhotoModal } from './set-photo.modal';
import { EditDetailsModal } from './edit-details.modal';
import { PostUpdateModal } from './post-update.modal';
import { AddContactModal } from './add-contact.modal';
import { AddThingModal } from './add-thing.modal';
import { RemoveContactModal } from './remove-contact.modal';
import { SigninRequiredModal } from './signin-required.modal';
import { InviteModal } from './invite.modal';
import { EditRoleModal } from './edit-role.modal';
import { InfoModal } from './info.modal';

import { ExactRouteReuseStrategy } from './exact.reuse';
import { LocalityCardComponent } from './locality-card/locality-card.component';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { ChatComponent } from './chat/chat.component';
import { AdAddComponent } from './ad-add/ad-add.component';
import { FormComponent } from './form/form.component';
import { ClubTagComponent } from './club-tag/club-tag.component';
import { NewClubModalComponent } from './new-club-modal/new-club-modal.component';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { VisibilityPickerComponent } from './visibility-picker/visibility-picker.component';
import { AddActionModal } from './add-action.modal/add-action.modal.component';
import { ActionViewComponent } from './action-view/action-view.component';
import { ColorWheelComponent } from './color-wheel/color-wheel.component';
import { ThingInComponent } from './thing-in/thing-in.component';
import { ModeViewComponent } from './mode-view/mode-view.component';
import { SetLocationModalComponent } from './set-location-modal/set-location-modal.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { WindowScrollComponent } from './window-scroll/window-scroll.component';
import { ThingCardsComponent } from './thing-cards/thing-cards.component';
import { ThingListComponent } from './thing-list/thing-list.component';
import { TimeComponent } from './time/time.component';
import { ThingLinkComponent } from './thing-link/thing-link.component';
import { UpdateComponent } from './update/update.component';
import { GoalsComponent } from './goals/goals.component';
import { ThingPreviewComponent } from './thing-preview/thing-preview.component';
import { ThingPreviewListComponent } from './thing-preview-list/thing-preview-list.component';
import { CompleteGoalComponent } from './complete-goal/complete-goal.component';
import { AddModeModalComponent } from './add-mode-modal/add-mode-modal.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { HorizontalListComponent } from './horizontal-list/horizontal-list.component';
import { ModesComponent } from './modes/modes.component';
import { ThingUpdatePreviewComponent } from './thing-update-preview/thing-update-preview.component';
import { AuthInterceptor } from './auth.interceptor';

enableProdMode();

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
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
        MapComponent,
        PersonLinkComponent,
        ThingUpdatesComponent,
        ThingUpdateComponent,
        MainComponent,
        MessagesComponent,
        AddMemberComponent,
        ThingTabsComponent,
        TabsForComponent,

        ProfileComponent,
        ProjectsComponent,
        HubsComponent,
        ClubsComponent,
        ResourcesComponent,
        PeopleComponent,
        SearchComponent,
        ProjectComponent,
        ParseLinksComponent,

        ParseLinksPipe,
        FilterPipe,

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
        NewFormModal,
        InviteModal,
        AddThingModal,
        EditRoleModal,
        InfoModal,
        LocalityCardComponent,
        IntroCardComponent,
        ChatComponent,
        AdAddComponent,
        FormComponent,
        ClubTagComponent,
        NewClubModalComponent,
        SearchboxComponent,
        SettingsComponent,
        VisibilityPickerComponent,
        AuthenticateComponent,
        AddActionModal,
        ActionViewComponent,
        ColorWheelComponent,
        ThingInComponent,
        ModeViewComponent,
        SetLocationModalComponent,
        SpinnerComponent,
        WindowScrollComponent,
        ThingCardsComponent,
        ThingListComponent,
        TimeComponent,
        ThingLinkComponent,
        UpdateComponent,
        GoalsComponent,
        ThingPreviewComponent,
        ThingPreviewListComponent,
        CompleteGoalComponent,
        AddModeModalComponent,
        UploadFileComponent,
        ConfirmationModalComponent,
        HorizontalListComponent,
        ModesComponent,
        ThingUpdatePreviewComponent,
    ],
    entryComponents: [
        FeedbackModal,
        WelcomeModal,
        GdayModal,
        NewHubModal,
        NewOfferModal,
        NewFormModal,
        SetPhotoModal,
        EditDetailsModal,
        PostUpdateModal,
        AddContactModal,
        RemoveContactModal,
        SigninRequiredModal,
        NewProjectModal,
        NewResourceModal,
        InviteModal,
        NewClubModalComponent,
        AddActionModal,
        SetLocationModalComponent,
        AddModeModalComponent,
        ConfirmationModalComponent,
    ],
    providers: [
        InforService,
        ApiService,
        TutorialService,
        WebTitleService,
        LocalityService,
        ChatService,
        UiService,
        WorldService,
        {provide: RouteReuseStrategy, useClass: ExactRouteReuseStrategy},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor(private webTitleService: WebTitleService) {}
}
