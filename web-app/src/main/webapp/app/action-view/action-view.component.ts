declare var $: any;
declare var Waves;

import { Component, OnInit, AfterViewInit, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { InforService } from '../infor.service';
import { ApiService } from '../api.service';
import { AddActionModal } from '../add-action.modal/add-action.modal.component';

@Component({
  selector: 'action-view',
  templateUrl: './action-view.component.html',
  styleUrls: ['./action-view.component.css']
})
export class ActionViewComponent implements OnInit, AfterViewInit {

    @Input() action;
    value: string;
    private modal;

    constructor(
            private resolver: ComponentFactoryResolver,
            private view: ViewContainerRef,
            private inforService: InforService,
            private api: ApiService
    ) { }

    ngOnInit() {
        switch(this.action.type) {
            case 'color':
                this.value = this.makeColor(this.action.message);
                break;
            default:
                this.value = this.action.message;
        }
    }

    ngAfterViewInit() {
        Waves.displayEffect();
    }

    set() {
        switch(this.action.type) {
            case 'color':
            case 'slider':
                this.save();
                break;
            case 'switch':
                if (this.value === this.action.data.config.onValue) {
                    this.value = this.action.data.config.offValue;
                } else {
                    this.value = this.action.data.config.onValue;
                }
                this.save();
                break;
            case 'trigger':
                this.value = 'true';
                this.save();
                break;
            case 'text':
            default:
                this.save();
                this.value = '';
        }
    }

    save() {
        let value = undefined;

        switch (this.action.type) {
            case 'color':
                value = this.getColor(this.value);
                break;
            case 'slider':
            case 'switch':
            case 'text':
            case 'trigger':
                value = this.value;
                break;
        }

        if (value !== undefined) {
            this.api.earthEdit(this.action.id, {
                value: value
            }).subscribe();
        }
    }

    getColor(color: any) {
        return JSON.stringify(color);
    }

    makeColor(color: any) {
        return color ? JSON.parse(color) : [0, 0, 0];
    }

    canEdit() {
        return this.inforService.getId() === this.action.source.id;
    }

    edit() {
        if (!this.modal) {
            this.modal = this.view.createComponent(this.resolver.resolveComponentFactory(AddActionModal));
            this.modal.instance.action = this.action;
            this.modal.instance.thing = this.action.target;
        }

        let modalView = $(this.modal.location.nativeElement).find('.modal');
        setTimeout(() => modalView.modal('open'));
    }
}
