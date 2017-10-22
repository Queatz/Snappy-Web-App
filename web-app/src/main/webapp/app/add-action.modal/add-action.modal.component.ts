declare var $;
declare var _;
declare var Waves;
declare var Materialize;

import { Component, OnInit, OnDestroy, Input, AfterViewInit, ElementRef, SimpleChanges } from '@angular/core';

import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import util from '../util';

@Component({
  selector: 'add-action-modal',
  templateUrl: './add-action.modal.component.html',
  styleUrls: ['./add-action.modal.component.css']
})
export class AddActionModal implements OnInit, OnDestroy, AfterViewInit {

    @Input() thing;
    @Input() action;

    types = [
        { name: 'color', icon: 'color_lens', color: 'red', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { format: 'r:g:b' }},
        { name: 'text', icon: 'mode_edit', color: 'green', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: {}},
        { name: 'switch', icon: 'brightness_6', color: 'orange', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { onValue: 'on', offValue: 'off' }},
        { name: 'slider', icon: 'tune', color: 'purple', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { minValue: '0', maxValue: '1', isFloat: true }},
        { name: 'trigger', icon: 'star', color: 'yellow', variables: 'Use {{value}} in URLs. Use {{person}} to get the id of the person using the action.', config: { value: '' }},
    ];

    name: string;
    clubs: any;
    isPublic: boolean;

    changeNotificationUrls = [];
    statusCallbackUrls = [];
    type: string = '';
    actionConfig: any;

    constructor(private api: ApiService, private inforService: InforService, private elementRef: ElementRef) { }

    ngOnInit() {
        this.refreshClubToggles();
        this.update();
    }

    ngOnDestroy() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['action']) {
            this.update();
        }
    }

    update() {
        if (this.action) {
            this.name = this.action.role;
            this.changeNotificationUrls = this.action.data.changeNotificationUrls;
            this.statusCallbackUrls = this.action.token ? [{ url: this.action.token }] : [];
            this.type = this.action.type;
            this.actionConfig = this.action.data.config;
        }
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

    setType(type: string, event: Event = null) {
        if (event) {
            event.preventDefault();
        }

        this.type = type;

        this.actionConfig = (<any>Object).assign({}, _.find(this.types, { name: this.type }).config);
    }

    getVariables() {
        return _.find(this.types, { name: this.type }).variables;
    }

    addStatusCallbackUrl(url: string) {
        this.statusCallbackUrls.push({ url: util.rndstr() });
    }

    addChangeNotificationUrl() {
        this.changeNotificationUrls.push({ url: 'http://example.com?command=\{\{value\}\}', method: 'GET', params: [] });
    }

    toggleMethod(cn: any) {
        cn.method = (cn.method === 'GET' ? 'POST' : 'GET');
    }

    addParam(cn: any) {
        cn.params.push({ key: '', value: '' });
    }

    deleteParam(cn: any, param: any) {
        let i = cn.params.indexOf(param);

        if (i === -1) {
            return;
        }

        cn.params.splice(i, 1);
    }

    deleteChangeNotificationUrl(url: any) {
        let i = this.changeNotificationUrls.indexOf(url);

        if (i === -1) {
            return;
        }

        this.changeNotificationUrls.splice(i, 1);
    }

    deleteStatusCallbackUrls(url: any) {
        let i = this.statusCallbackUrls.indexOf(url);

        if (i === -1) {
            return;
        }

        this.statusCallbackUrls.splice(i, 1);
    }

    add() {
        if (!this.name || !this.name.trim()) {
            Materialize.toast('Enter action role', 4000);
            return;
        }

        if (!this.type) {
            Materialize.toast('Choose action type', 4000);
            return;
        }

        let data = {
            config: this.actionConfig,
            changeNotificationUrls: this.changeNotificationUrls
        };

        if (this.action) {
            this.api.earthEdit(this.action.id, {
                role: this.name,
                type: this.type,
                token: this.statusCallbackUrls.length ? this.statusCallbackUrls[0].url : '',
                data: JSON.stringify(data),
                hidden: !this.isPublic,
                clubs: JSON.stringify(this.clubs)
            }).subscribe(form => {
                $(this.elementRef.nativeElement.querySelector('.modal')).modal('close');
            });
        } else {
            this.api.earthCreate({
                kind: 'action',
                source: this.inforService.getId(),
                target: this.thing.id,
                role: this.name,
                type: this.type,
                token: this.statusCallbackUrls.length ? this.statusCallbackUrls[0].url : '',
                data: JSON.stringify(data),
                hidden: !this.isPublic,
                clubs: JSON.stringify(this.clubs)
            }).subscribe(form => {
                $(this.elementRef.nativeElement.querySelector('.modal')).modal('close');
            },
            error => {
                Materialize.toast('Save action failed', 4000);
            });
        }
    }

    remove() {
        this.api.earthDelete(this.action.id)
            .subscribe((res: any) => {
                Materialize.toast('Action removed', 4000);
                $(this.elementRef.nativeElement.querySelector('.modal')).modal('close');
            },
            error => {
                Materialize.toast('Action remove failed', 4000);
            });
    }
}
