declare var $: any;
declare var Waves;
declare var _: any;

import { Component, ElementRef, Input, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

import { MapComponent } from './map.component';

@Component({
    selector: 'edit-details-modal',
    templateUrl: './edit-details.modal.html',
    styleUrls: ['./edit-details.modal.css'],
})
export class EditDetailsModal implements OnInit, OnDestroy, AfterViewInit {
    @Input() thing;

    @ViewChild(MapComponent, { static: false })
    private map: MapComponent;
    private element;
    private name;
    private about;
    private clubs;
    private address;
    private isPublic;
    private formItems = [];

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngOnInit() {
        switch (this.thing.kind) {
            case 'hub':
                this.name = this.thing.name;
                this.about = this.thing.about;
                this.address = this.thing.address;
                break;
            case 'form':
                this.name = this.thing.name;
                this.about = this.thing.about;

                try {
                    this.formItems = this.thing.data ? JSON.parse(this.thing.data) : [];
                } catch(err) {
                    console.error(err);
                    this.formItems = [];
                }
                break;
            case 'resource':
            case 'project':
            case 'club':
                this.name = this.thing.name;
                this.about = this.thing.about;
                break;
        }

        this.refreshClubToggles();
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

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelectorAll('.modal')).modal();
        $(this.element.querySelectorAll('select')).formSelect();
        $(this.element.querySelectorAll('.dropdown-trigger')).dropdown({
            constrainWidth: false
        });
    }

    ngOnDestroy() {
        $(this.element.querySelectorAll('select')).formSelect('destroy');
    }

    updateAddress() {
        this.map.updateAddress(this.address);
    }

    isCommon() {
        return this.thing.kind === 'resource' ||
            this.thing.kind === 'project' ||
            this.thing.kind === 'club';
    }

    canEditClubs() {
        return true;
    }

    save() {
        switch (this.thing.kind) {
            case 'hub':
                return this.saveHub();
            case 'form':
                return this.saveForm();
            case 'resource':
            case 'project':
            case 'club':
                return this.saveResource();
        }
    }

    public canEdit() {
        if (this.thing.owner) {
            return true;
        }

        if (!this.inforService.getInforUser()) {
            return false;
        }

        var me = this.inforService.getInforUser().id;

        return this.thing && _.any(this.thing.contacts, t => t.source.target.id === me);
    }

    remove() {
        $(this.element.querySelector('#modal-remove')).modal('open');
    }

    confirmRemove() {
        this.api.earthDelete(this.thing.id).subscribe(() => {
            $(this.element.querySelector('#modal-remove')).modal('close');
           this.router.navigate(['/']);
        })
    }

    addFormItem(type: string) {
        let item: any = {
            type: type
        };

        switch (type) {
            case 'choice':
                item.choices = [{
                    about: ''
                }];
                break;
        }

        this.formItems.push(item);
    }

    addFormItemChoice(formItem: any) {
        formItem.choices.push({
            about: ''
        });
    }

    deleteFormItemChoice(formItem: any, choice: any) {
        let i = formItem.choices.indexOf(choice);

        if (i === -1) {
            return;
        }

        formItem.choices.splice(i, 1);
    }

    moveFormItem(formItem: any, amount: number) {
        let i = this.formItems.indexOf(formItem);

        if (i === -1) {
            return;
        }

        if (i + amount < 0) {
            return;
        }

        if (i + amount > this.formItems.length) {
            return;
        }

        this.formItems.splice(i, 1);
        this.formItems.splice(i + amount, 0, formItem);
    }

    deleteFormItem(formItem: any) {
        let i = this.formItems.indexOf(formItem);

        if (i === -1) {
            return;
        }

        this.formItems.splice(i, 1);
    }

    saveResource() {
        if (!this.name) {
            return;
        }

        this.api.earthEdit(this.thing.id, {
            name: this.name,
            about: this.about,
            hidden: !this.isPublic,
            clubs: JSON.stringify(this.clubs)
        }).subscribe(updatedThing => {
            this.thing.name = updatedThing.name;
            this.thing.about = updatedThing.about;
            this.thing.clubs = updatedThing.clubs;
            this.thing.hidden = updatedThing.hidden;
            this.refreshClubToggles();
            $(this.element.querySelector('#editDetailsModal')).modal('close');
        });
    }

    saveForm() {
        if (!this.name) {
            return;
        }

        this.api.earthEdit(this.thing.id, {
            name: this.name,
            about: this.about,
            data: JSON.stringify(this.formItems),
            hidden: !this.isPublic,
            clubs: JSON.stringify(this.clubs)
        }).subscribe(updatedThing => {
            this.thing.name = updatedThing.name;
            this.thing.about = updatedThing.about;
            this.thing.clubs = updatedThing.clubs;
            this.thing.hidden = updatedThing.hidden;
            this.refreshClubToggles();
            $(this.element.querySelector('#editDetailsModal')).modal('close');
        });
    }

    saveHub() {
        if (!this.name) {
            return;
        }

        this.api.earthEdit(this.thing.id, {
            name: this.name,
            address: this.address,
            about: this.about,
            hidden: !this.isPublic,
            clubs: JSON.stringify(this.clubs),
            latitude: this.map.getMarkerPosition().lat(),
            longitude: this.map.getMarkerPosition().lng()
        }).subscribe(updatedThing => {
            this.thing.name = updatedThing.name;
            this.thing.address = updatedThing.address;
            this.thing.about = updatedThing.about;
            this.thing.clubs = updatedThing.clubs;
            this.thing.hidden = updatedThing.hidden;
            this.refreshClubToggles();
            $(this.element.querySelector('#editDetailsModal')).modal('close');
        });
    }
}
