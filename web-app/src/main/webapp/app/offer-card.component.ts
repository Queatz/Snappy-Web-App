declare var $;
declare var Waves;
declare var Materialize;
declare var Promise;

import { Component, ComponentFactoryResolver, ViewContainerRef, Input, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InforService } from './infor.service';
import { ApiService } from './api.service';
import { NewOfferModal } from './new-offer.modal';

var checkFirst = true;

@Component({
    selector: 'offer-card',
    templateUrl: './offer-card.component.html',
    styleUrls: ['./offer-card.component.css']
})
export class OfferCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public offer;
    @Input() public resizeCallback;
    @Input() public removeCallback;
    filesToUpload: Array<File>;

    private element;
    private offerImage;
    private modal;
    public efile;

    constructor(
        private inforService: InforService,
        private api: ApiService,
        private _router: Router,
        element: ElementRef,
        private resolver: ComponentFactoryResolver,
        private view: ViewContainerRef
    ) {
        this.element = element.nativeElement;
        this.filesToUpload = [];
    }

    ngOnInit() {
        if (this.offer.kind == 'member') {
            this.offer.source.member = this.offer;
            this.offer = this.offer.source;
        }
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        $(this.element).find('.tooltipped').tooltip({delay: 50});
        $(this.element.querySelectorAll('.modal')).modal();
        this.offerImage = this.api.earthImageUrl(this.offer.id);

    }

    ngOnDestroy() {
        $(this.element).find('.tooltipped').tooltip('remove');
    }

    public getPrice() {
        var offer = this.offer;
        var str;
        if (offer.price < 0) {
            str = 'For $' + Math.abs(offer.price);
        } else if (offer.price === 0) {
            return 'Count me in';
        } else if (offer.price > 0) {
            str = 'For $' + offer.price;
        } else {
            return 'Ask';
        }

        if (offer.unit) {
            str = str + '/' + offer.unit;
        }

        return str;
    }

    public isRequest() {
        return this.offer.want || (this.offer.price !== null && this.offer.price < 0);
    }

    public getOfferTypeText() {
        if (this.isRequest()) {
            return this.offer.source.firstName + ' wants';
        } else {
            return this.offer.source.firstName + ' offers';
        }
    }

    public loaded() {
        if (this.resizeCallback) {
            this.resizeCallback();
        }
    }

    public isProfile() {
        return this.inforService.getInforUser() &&
            this.inforService.getInforUser().id === this.offer.source.id;
    }

    public isProfileOr() {
        var user = this.inforService.getInforUser();
        return this.isProfile() || (user && this.offer.member && this.offer.member.target && this.offer.member.target.id === user.id);
    }

    public clickPrice() {
        if (this.isProfile()) {
            return;
        }

        this._router.navigate(['/messages/' + this.offer.source.id], {
            queryParams: {
                q: encodeURIComponent(this.getPrefillText())
            }
        });
    }

    private getPrefillText() {
        return (this.isRequest() ? 'I\'ve got ' : 'Count me in for ') + this.offer.about;
    }

    public deleteOffer() {
        if (this.offer.member) {
            this.api.earthDelete(this.offer.member.id)
                .subscribe(res => {
                    if (res.status == 200) {
                        Materialize.toast('Offer removed', 4000);

                        if (this.removeCallback) {
                            this.removeCallback(this.offer);
                        }
                    } else {
                        Materialize.toast('Failed to remove offer', 4000);
                    }
                });

            return;
        }

        if (this.offer) {
            this.api.earthDelete(this.offer.id)
                .subscribe(res => {
                    if (res.status == 200) {
                        Materialize.toast('Offer deleted', 4000);
                        if (this.removeCallback) {
                            this.removeCallback(this.offer);
                        }
                    } else {
                        Materialize.toast('Offer delete failed', 4000);
                    }
                });
        }
    }
    public uploadPhoto() {
        if (this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/)) {
            this.offerImage = "";
            this.makeFileRequest(this.api.earthImageUrl(this.offer.id), this.filesToUpload)
                .then(result => {
                    if (result) {
                        Materialize.toast('Photo updated', 4000);
                        this.offer.photo = true;
                        this.offerImage = this.api.earthImageUrl(this.offer.id);
                    }
                    else
                        Materialize.toast('Photo update failed', 4000);
                }, (error) => {
                    console.error(error);
                });
        } else {
            Materialize.toast('No photo', 4000);
        }
    }

    makeFileRequest(url: string, files: Array<File>) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append('photo', files[0], files[0].name);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    deleteImage() {
        if (this.offer) {
            this.api.earthDeletePhoto(this.offer.id)
                .subscribe(res => {
                    if (res.status == 200) {
                        Materialize.toast('Photo removed', 4000);
                        this.offerImage = '';
                        if (this.resizeCallback) {
                            this.resizeCallback(this.offer);
                        }
                        setTimeout(() => {
                            this.offer.photo = false;
                        }, 50);
                    } else {
                        Materialize.toast('Photo remove failed', 4000);
                    }
                });
        }
    }

    edit() {
        if (this.modal) {
            this.modal.modal('open');
            return;
        }

        var self = this;

        let ref = this.view.createComponent(this.resolver.resolveComponentFactory(NewOfferModal));
        ref.instance.offer = self.offer;
        ref.instance.resizeCallback = self.resizeCallback;
        self.modal = $(ref.location.nativeElement).find('.modal');
        setTimeout(() => self.modal.modal('open'));
    }
}
