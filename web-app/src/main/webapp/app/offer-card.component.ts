import { Component, View, Input, AfterViewInit, ElementRef} from 'angular2/core';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions } from 'angular2/http';
import { InforService } from './infor.service';
import { ApiService } from './api.service';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
    headers: Headers = firstHeaders
}

var checkFirst = true;

@Component({
    selector: 'offer-card',
    templateUrl: 'app/offer-card.component.html',
    styleUrls: ['app/offer-card.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class OfferCardComponent implements AfterViewInit {
    @Input() public position;
    @Input() public size;
    @Input() public offer;
    @Input() public resizeCallback;
    @Input() public deleteCallback;
    @Input() public profile;
    filesToUpload: Array<File>;

    constructor(inforService: InforService,
        private api: ApiService,
        http: Http,
        private _router: Router,
        element: ElementRef) {
        this.inforService = inforService;
        this.http = http;
        this.element = element.nativeElement;
        this.filesToUpload = [];
    }

    ngAfterViewInit() {
        Waves.displayEffect();
        this.offerImage = 'http://queatz-snappy.appspot.com/api/offer/' + this.offer.id +
            '/photo?s=800&auth=' + this.api.token();
        this.showModal();
    }

    public getPrice() {
        var offer = this.offer;
        var str;
        if (offer.price < 0) {
            str = 'Make $' + Math.abs(offer.price);
        } else if (offer.price === 0) {
            return 'Free';
        } else if (offer.price > 0) {
            str = '$' + offer.price;
        } else {
            return 'Ask';
        }

        if (offer.unit) {
            str = str + '/' + offer.unit;
        }

        return str;
    }

    public isRequest() {
        return this.offer.price !== null && this.offer.price < 0;
    }

    public getOfferTypeText() {
        if (this.isRequest()) {
            return this.offer.person.firstName + ' wants';
        } else {
            return this.offer.person.firstName + ' offers';
        }
    }

    public loaded() {
        this.resizeCallback();
    }

    public getPosition() {
        return this.position + this.inforService.getOfferSize();
    }

    public isProfile() {
        return this.profile;
    }

    public clickPrice() {
        if (this.profile) {
            return;
        }

       this._router.navigate( ['Messages', {id: this.offer.person.id, q: this.getPrefillText()}] );
    }

    private getPrefillText() {
        return (this.isRequest() ? 'I\'ve got ' : 'I\'d like ') + this.offer.details;
    }

    public deleteOffer() {
        if (this.offer) {
            this.http.delete('http://queatz-snappy.appspot.com/api/me/offers/' + this.offer.id + '?auth=' + this.inforService.getInforUser().auth, [])
                .map(res => {
                    if (res.status == 200) {
                        Materialize.toast('Offer deleted', 4000);
                        this.deleteCallback(this.position, 1);
                    } else {
                        Materialize.toast('Offer delete failed', 4000);
                    }
                })
                .subscribe();
        }
    }
    public uploadPhoto() {
        if (this.filesToUpload.length > 0 && this.filesToUpload[0].type.match(/image/)) {
            this.offerImage = "";
            this.makeFileRequest("http://queatz-snappy.appspot.com/api/offer/" + this.offer.id
                + "/photo?auth=" + this.inforService.getInforUser().auth, [], this.filesToUpload)
                .then(result => {
                    if (result) {
                        Materialize.toast('Photo updated', 4000);
                        this.offer.hasPhoto = true;
                        this.offerImage = 'http://queatz-snappy.appspot.com/api/offer/' + this.offer.id +
                            '/photo?s=800&auth=' + this.api.token();
                        this.deleteCallback(this.position, 3);
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

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
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
            xhr.open('PUT', url, true);
            xhr.send(formData);
        });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    deleteImage() {
        if (this.offer) {
            this.http.delete('http://queatz-snappy.appspot.com/api/offer/' + this.offer.id + '/photo?auth=' + this.inforService.getInforUser().auth, [])
                .map(res => {
                    if (res.status == 200) {
                        Materialize.toast('Photo removed', 4000);
                        this.offerImage = '';
                        this.deleteCallback(this.position, 3);
                        setTimeout(() => {
                            this.offer.hasPhoto = false;
                        }, 50);
                    } else {
                        Materialize.toast('Photo remove failed', 4000);
                    }
                })
                .subscribe();
        }
    }

    showModal() {
        if (this.isProfile() && this.inforService.getListOfferCheck(this.getPosition() + '-1') === false) {
            if (this.inforService.getDeleteOffer() < 0 || (this.inforService.getDeleteOffer() === 0 && !this.inforService.deletedSomeItem)) {
                $(this.element).find('.modal-trigger').leanModal();
            }
        }
    }
}
