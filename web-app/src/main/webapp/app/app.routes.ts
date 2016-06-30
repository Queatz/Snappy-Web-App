import { provideRouter, RouterConfig } from '@angular/router';
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

export const routes: RouterConfig = [
    { path: '',              name: 'Main',       component: MainComponent, useAsDefault: true },
    { path: 'messages',      name: 'Messages',   component: MessagesComponent },
    { path: 'messages/:id',  name: 'Messages',   component: MessagesComponent },
    { path: 'hubs',          name: 'Hubs',       component: HubsComponent },
    { path: 'clubs',         name: 'Clubs',      component: ClubsComponent },
    { path: 'projects',      name: 'Projects',   component: ProjectsComponent },
    { path: 'resources',     name: 'Resources',  component: ResourcesComponent },
    { path: 'people',        name: 'People',     component: PeopleComponent },
    { path: 'hubs/:id',      name: 'Hub',        component: ProjectComponent },
    { path: 'clubs/:id',     name: 'Club',       component: ProjectComponent },
    { path: 'projects/:id',  name: 'Project',    component: ProjectComponent },
    { path: 'resources/:id', name: 'Resource',   component: ProjectComponent },
    { path: 'search/:query', name: 'Search',     component: SearchComponent },
    { path: ':id',           name: 'Profile',    component: ProfileComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];