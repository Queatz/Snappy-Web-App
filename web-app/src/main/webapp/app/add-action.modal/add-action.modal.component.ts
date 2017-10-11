declare var $;
declare var _;
declare var Waves;

import { Component, OnInit, OnDestroy, Input, AfterViewInit, ElementRef } from '@angular/core';

import { ApiService } from '../api.service';

@Component({
  selector: 'add-action-modal',
  templateUrl: './add-action.modal.component.html',
  styleUrls: ['./add-action.modal.component.css']
})
export class AddActionModal implements OnInit, OnDestroy, AfterViewInit {

    @Input() thing;

    private types = [
        { name: 'color', icon: 'color_lens', color: 'red', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { format: 'r:g:b' }},
        { name: 'text', icon: 'mode_edit', color: 'green', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: {}},
        { name: 'switch', icon: 'brightness_6', color: 'orange', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { onValue: 'on', offValue: 'off' }},
        { name: 'slider', icon: 'tune', color: 'purple', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { minValue: '0', maxValue: '1', isFloat: true }},
        { name: 'trigger', icon: 'star', color: 'yellow', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { value: '' }},
    ];

    private name: string;
    private clubs: any;
    private isPublic: boolean;

    private changeNotificationUrls = [];
    private statusCallbackUrls = [];
    private type: string = '';
    private actionConfig: any;

    constructor(private api: ApiService, private elementRef: ElementRef) { }

    ngOnInit() {
        this.refreshClubToggles();
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.elementRef.nativeElement.querySelectorAll('.modal')).modal();
        $(this.elementRef.nativeElement.querySelectorAll('select')).material_select();
    }

    refreshClubToggles() {
        this.isPublic = !this.thing.hidden;

        this.clubs = {};

        if (this.thing.clubs) {
            this.thing.clubs.forEach(club => {
                this.clubs[club.id] = true;
            });
        }
    }

    setType(type: string) {
        this.type = type;

        this.actionConfig = (<any>Object).assign({}, _.find(this.types, { name: this.type }).config);
    }

    getVariables() {
        return _.find(this.types, { name: this.type }).variables;
    }

    addStatusCallbackUrl(url: string) {
        this.statusCallbackUrls.push(url);
    }

    addChangeNotificationUrl(url: string) {
        this.changeNotificationUrls.push(url);
    }

    deleteChangeNotificationUrl(url: any) {
        let i = this.changeNotificationUrls.indexOf(url);

        if (i === -1) {
            return;
        }

        this.changeNotificationUrls.splice(i, 1);
    }

    add() {

    }
}
