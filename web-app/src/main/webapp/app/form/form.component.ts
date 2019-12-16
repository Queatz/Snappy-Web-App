declare var M: any;

import { ComponentFactoryResolver, ViewContainerRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InforService } from '../infor.service';
import { ApiService } from '../api.service';
import { NewFormModal } from '../new-form.modal';
import { SigninRequiredModal } from '../signin-required.modal';
import util from '../util';

@Component({
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    public thing: any;
    public id: string;
    public formItems: any;
    public files: Map<string, File> = new Map<string, File>();
    public photos: Map<string, File> = new Map<string, File>();
    public notFound: boolean;
    public formCompleted: boolean;
    public isSubmitting: boolean;

    constructor(
            private resolver: ComponentFactoryResolver,
            private view: ViewContainerRef,
            private inforService: InforService,
            private api: ApiService,
            private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.load(this.id);
        });
    }

    load(id: string) {
        this.api.earthThing(id, ApiService.SELECT_FORM).subscribe(form => {
            this.thing = form;
            this.formItems = JSON.parse(form.data);
            this.formItems.forEach(i => i.__id = util.rndstr());
        }, err => this.notFound = true);

        let modal: any = this.inforService.getInforUser() ? NewFormModal : SigninRequiredModal;

        if (modal) {
            this.view.createComponent(this.resolver.resolveComponentFactory(modal));
        }
    }

    photoChangeEvent(event: any, formItem: any) {
        if (event.target.files.length) {
            this.photos[formItem.__id] = event.target.files[0];
        } else {
            delete this.photos[formItem.__id];
        }
    }

    fileChangeEvent(event: any, formItem: any) {
        if (event.target.files.length) {
            this.files[formItem.__id] = event.target.files[0];
        } else {
            delete this.files[formItem.__id];
        }
    }

    submit() {
        if (this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;
        this.api.submitForm(this.id, this.files, this.photos, this.formItems).subscribe(
            result => {
                this.formCompleted = true;
                this.isSubmitting = false;
            }, error => {
                this.isSubmitting = false;
                M.toast({ html: 'Something went wrong' });
            }
        );
    }

    public getPhotoUrl() {
        if (this.thing && this.thing.photo) {
            return this.api.earthPhotoUrl(this.thing.id);
        }
    }
}
