declare var M: any;
declare var $: any;
declare var Waves: any;
declare var M: any;

import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { WebTitleProvider } from '../extra';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { of } from 'rxjs';

@Component({
  selector: 'goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements AfterViewInit, WebTitleProvider {
    public goals: any[];

    public newGoal: string = '';
    public isPublic: boolean = true;
    public clubs: any = {};

    private element: HTMLElement;

    constructor(private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
        this.inforService.getLocation(this.loadNearby.bind(this));
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        M.textareaAutoResize($('#newGoal'));
    }

    addGoal() {
        if (!this.inforService.getInforUser()) {
            M.toast({ html: 'Sign in' });
            return;
        }

        if (!this.newGoal.trim()) {
            M.toast({ html: 'Enter goal' });
            return;
        }

        this.api.earthCreate({
            kind: 'goal',
            name: this.newGoal,
            hidden: !this.isPublic,
            in: this.inforService.getInforUser().id,
            clubs: JSON.stringify(this.clubs),
            select: 'id,name',
        }).subscribe(goal => {
            M.toast({ html: 'Goal added' });
        });
    }
  
    private loadNearby(position) {
        this.api.earthHere(position.coords, 'goal', ApiService.SELECT_THINGS_WITH_MEMBERS)
            .subscribe(goals => {
                this.loaded(goals);
            },
            error => {
                this.goals = [];
            });
    }

    private loaded(goals) {
        this.goals = goals;
    }

    public getWebTitle() {
        return of('Goals');
    }
}
