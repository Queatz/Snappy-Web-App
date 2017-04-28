declare var $;
declare var _;
declare var Waves;
declare var Materialize;

import { Component, ElementRef, Input, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'edit-role-modal',
    templateUrl: 'app/edit-role.modal.html',
    styleUrls: ['app/edit-role.modal.css'],
})
export class EditRoleModal implements OnInit, AfterViewInit {
    @Input() thing;
    private newRole;
    private element;

    constructor(private router: Router, private api: ApiService, private inforService: InforService, element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngOnInit() {
        this.newRole = this.thing.role;
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element.querySelector('.modal')).modal();
    }

    confirmRole() {
        this.api.earthEdit(this.thing.id, {
            role: this.newRole
        }).subscribe(success => {
            this.thing.role = this.newRole;
            $(this.element.querySelector('.modal')).modal('close');
        });
    }
}
