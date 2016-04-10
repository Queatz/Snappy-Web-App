import { Component, ElementRef } from 'angular2/core';
import { FloatingComponent } from './floating.component';
import { ROUTER_DIRECTIVES, OnActivate } from 'angular2/router';
import { ProjectCardComponent } from './project-card.component';
import { InforService } from './infor.service';
import { NewHubModal } from './new-hub.modal';

@Component({
    templateUrl: 'app/hubs.component.html',
    styleUrls: ['app/hubs.component.css'],
    directives: [ROUTER_DIRECTIVES, FloatingComponent, ProjectCardComponent]
})
export class HubsComponent implements OnActivate {
    public hubs;

    constructor(inforService: InforService, element: ElementRef) {
        this.inforService = inforService;
        this.element = element.nativeElement;
        this.loaded([{kind: 'hub', id: '1'}, {kind: 'hub', id: '2'}, {kind: 'hub', id: '3'}]);
        this.newHubModal = NewHubModal;
    }

    private loaded(hubs) {
        this.hubs = hubs;

        setTimeout(() => {
            var elem = this.element.querySelector('.grid');
            this.masonry = new Masonry(elem, {
                itemSelector: '.item',
                gutter: 24,
                fitWidth: true
            });
        });
    }

    routerOnActivate() {
        this.inforService.setPageTitle('Hubs');
    }
}
