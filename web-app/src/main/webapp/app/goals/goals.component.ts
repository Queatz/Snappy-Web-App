declare var Waves: any;
declare var Materialize: any;

import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { WebTitleProvider } from '../extra';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { Observable } from 'rxjs';

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
    }

    addGoal() {
        if (!this.inforService.getInforUser()) {
            Materialize.toast('Sign in', 4000);
            return;
        }

        if (!this.newGoal.trim()) {
            Materialize.toast('Enter goal', 4000);
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
            Materialize.toast('Goal added', 4000);
        });
    }
  
    private loadNearby(position) {
        this.api.earthHere(position.coords, 'goal', 'name,about,hidden,photo,in(target(name,photo,googleUrl,imageUrl,firstName,lastName)),clubs(name)')
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
        return Observable.of('Goals');
    }
}
