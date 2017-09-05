import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { ProfileComponent } from './profile.component';
import { MessagesComponent } from "./messages.component";
import { ProjectsComponent } from "./projects.component";
import { HubsComponent } from "./hubs.component";
import { ClubsComponent } from "./clubs.component";
import { ResourcesComponent } from "./resources.component";
import { PeopleComponent } from "./people.component";
import { SearchComponent } from "./search.component";
import { ProjectComponent } from "./project.component";
import { ChatComponent } from "./chat/chat.component";
import { FormComponent } from "./form/form.component";
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'messages',
        component: MessagesComponent
      },
      {
        path: 'messages/:id',
        component: MessagesComponent
      },
      {
        path: 'hubs',
        component: HubsComponent
      },
      {
        path: 'clubs',
        component: ClubsComponent
      },
      {
        path: 'projects',
        component: ProjectsComponent
      },
      {
        path: 'resources',
        component: ResourcesComponent
      },
      {
        path: 'people',
        component: PeopleComponent
      },
      {
        path: 'chat',
        component: ChatComponent,
        data: {
            reuse: true
        }
      },
      {
        path: 'chat/:topic',
        component: ChatComponent,
        data: {
            reuse: true
        }
      },
      {
        path: 'hubs/:id',
        component: ProjectComponent
      },
      {
        path: 'clubs/:id',
        component: ProjectComponent
      },
      {
        path: 'projects/:id',
        component: ProjectComponent
      },
      {
        path: 'resources/:id',
        component: ProjectComponent
      },
      {
        path: 'forms/:id',
        component: ProjectComponent
      },
      {
        path: 'forms/:id/submit',
        component: FormComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'search/:query',
        component: SearchComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: ':id',
        component: ProfileComponent
      },
      {
        path: ':id/:tab',
        component: ProfileComponent
      },
      {
        path: '**',
        redirectTo: '/'
      }
     ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}