declare var Promise;

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { InforService } from './infor.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    private _token = '';
    private beta = true;
    private _apiDomain = this.beta ? '127.0.0.1:8080' : 'vlllage.com:8443';
    private _apiBase = this.beta ? 'http://' + this._apiDomain : 'https://' + this._apiDomain;
    private _apiBaseUrl = this._apiBase + '/api/';

    constructor(private _http: Http, private inforService: InforService) {
 }

    public http() {
        return this._http;
    }

    public token() {
        if (this.inforService.getInforUser()) {
            return this.inforService.getInforUser().auth;
        }

        return this._token;
    }

    public ws(): WebSocket {
        return new WebSocket((this.beta ? 'ws://' : 'wss://') + this._apiDomain + '/ws');
    }

    public url(path: string) {
        return this._apiBase + path;
    }

    public getMe(gemail: string, gtoken: string) {
        var creds = 'email=' + gemail + '&auth=' + gtoken;

        return this._http.get(this._apiBaseUrl + 'earth/me?' + creds)
                .map((res: Response) => res.json());
    }

    public earthThing(id: string) {
        return this._http.get(this._apiBaseUrl + 'earth/' + id + '?auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public earthCreate(params, asPromise = false): any {
        var data = 'auth=' + this.token();

        for (var key in params) {
            if (key === 'photo') {
                continue;
            }

            data += '&' + key + '=' + encodeURIComponent(params[key]);
        }

        var formData = null;

        if (params.photo) {
            formData = new FormData();

            formData.append('photo', params.photo, params.photo.name);

            var headers = new Headers();
            headers.append('Content-Type', undefined);

        }

        // If nothing was specified to add this to, add it to the current user so that it doesn't
        // get disassociated and lost.
        if (!params['in']) {
            let userId = this.inforService.getId();
            if (userId) {
                params['in'] = userId;
            }
        }

        if (!asPromise) {
            return this._http.post(this._apiBaseUrl + 'earth', data, this.formHeaders())
                .map((res: Response) => res.json());
        } else {
            return this.makeFilePostRequest(this._apiBaseUrl + 'earth?' + data, formData);
        }
    }

    public earthEdit(id: string, params) {
        var data = 'auth=' + this.token();

        for (var key in params) {
            data += '&' + key + '=' + encodeURIComponent(params[key]);
        }

        return this._http.post(this._apiBaseUrl + 'earth/' + id, data, this.formHeaders());
    }

    public earthPhotoUrl(id: string): string {
        return this._apiBaseUrl + 'earth/' + id + '/photo?s=1200&auth=' + this.token();
    }

    // XXX currently returns a promise, so must use .then()
    public earthPutPhoto(id: string, photoFile: File) {
        var formData = new FormData();
        formData.append('photo', photoFile, photoFile.name);

        var headers = new Headers();
        headers.append('Content-Type', undefined);

        return this.makeFilePostRequest(this.earthPhotoUrl(id), formData);
    }

    // XXX currently returns a promise, so must use .then()
    public earthPostUpdate(thingId: string, message: string, photoFile: File) {
        var formData = new FormData();

        if (photoFile) {
            formData.append('photo', photoFile, photoFile.name);
        }

        if (message) {
            formData.append('message', message);
        }

        if (thingId) {
            formData.append('thing', thingId);
        }

        var headers = new Headers();
        headers.append('Content-Type', undefined);

        return this.makeFilePostRequest(this._apiBaseUrl + 'earth?kind=update&in=' + thingId + '&auth=' + this.token(), formData);
    }

    // XXX currently returns a promise, so must use .then()
    public earthSaveUpdate(updateId: string, message: string, photoFile: File) {
        var formData = new FormData();

        if (photoFile) {
            formData.append('photo', photoFile, photoFile.name);
        }

        if (message) {
            formData.append('message', message);
        }

        var headers = new Headers();
        headers.append('Content-Type', undefined);

        return this.makeFilePostRequest(this._apiBaseUrl + 'earth/' + updateId + '?auth=' + this.token(), formData);
    }

    public earthHere(coords, kind: string) {
        return this._http.get(this._apiBaseUrl + 'earth/here/' + kind
                                + '?latitude=' + coords.latitude
                                + '&longitude=' + coords.longitude
                                + '&auth='+ this.token())
                            .map((res: Response) => res.json());
    }

    public earthSearch(coords, q: string, kind: string) {
        return this._http.get(this._apiBaseUrl + 'earth/search' + (kind ? '/' + kind : '')
                                + '?latitude=' + coords.latitude
                                + '&longitude=' + coords.longitude
                                + '&q=' + encodeURIComponent(q)
                                + '&auth='+ this.token())
                            .map((res: Response) => res.json());
    }

    public setSeen(personId) {
        return this._http.get(this._apiBaseUrl + 'earth/' + personId + '?seen=true'
                              + '&auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public getPerson(personId) {
        return this._http.get(this._apiBaseUrl + 'earth/' + personId
                              + '?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public getPersonByName(personName) {
        return this._http.get(this._apiBaseUrl + 'earth/by-name/' + personName + '?auth=' + this.token())
            .map(res => res.json());
    }

    public messages() {
        return this._http.get(this._apiBaseUrl + 'earth/me/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public clubs() {
        return this._http.get(this._apiBaseUrl + 'earth/me/clubs?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public saveAbout(about: string) {
        return this._http.post(this._apiBaseUrl + 'earth/me/?about=' + encodeURIComponent(about) + '&auth=' + this.token(), '')
                           .map((res: Response) => res.json());
    }

    public personMessages(personId) {
        return this._http.get(this._apiBaseUrl + 'earth/' + personId
                              + '/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public newOffer(details, price, unit, asMemberOf = null, want = false) {
        var creds = "auth=" + this.token() +
        "&details=" + encodeURIComponent(details) +
        "&price=" + encodeURIComponent(price) +
        "&unit=" + encodeURIComponent(unit) +
        "&want=" + encodeURIComponent(want.toString()) +
        "&kind=offer" +
        (asMemberOf ? "&in=" + encodeURIComponent(asMemberOf.id) : "");
        return this._http.post(this._apiBaseUrl + 'earth', creds, this.formHeaders()).map((res: Response) => res.json());
    }

    public editOffer(offerId, details, price, unit, want) {
        var creds = "auth=" + this.token() +
            "&details=" + encodeURIComponent(details) +
            "&price=" + encodeURIComponent(price) +
            "&unit=" + encodeURIComponent(unit) +
            "&want=" + encodeURIComponent(want);
        return this._http.post(this._apiBaseUrl + 'earth/' + offerId, creds, this.formHeaders()).map((res: Response) => res.json());
    }

    public earthDelete(id: string) {
        return this._http.post(this._apiBaseUrl + 'earth/' + id + '/delete?auth=' + this.token(), '');
    }

    public earthDeletePhoto(id: string) {
        return this._http.post(this._apiBaseUrl + 'earth/' + id + '/photo/delete?auth=' + this.token(), '');
    }

    public earthImageUrl(id: string, size: Number = 800) {
        return this._apiBaseUrl + 'earth/' + id + '/photo?s=' + size + '&auth=' + this.token();
    }

    public sendMessage(personId, message) {
        var creds = "auth=" + this.token() + "&message=" + encodeURIComponent(message);

        return this._http.post(this._apiBaseUrl + 'earth/' + personId, creds, this.formHeaders())
            .map(res => res.json());
    }

    public sendFeedback(feedback) {
        var creds = "auth=" + this.token() + "&feedback=" + encodeURIComponent(feedback);

        return this._http.post(this._apiBaseUrl + 'earth/feedback', creds, this.formHeaders())
            .map(res => res.json());
    }

    public subscribeToLocality(coords: any, locality: string, email: string) {
        var data = 'latitude=' + coords.latitude +
                   '&longitude=' + coords.longitude +
                   '&name=' + encodeURIComponent(locality) +
                   '&email=' + encodeURIComponent(email);

        return this._http.post(this._apiBaseUrl + 'earth/geo-subscribe', data, this.formHeaders())
            .map(res => res.json());
    }

    private makeFilePostRequest(url: string, formData: FormData) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }

    private formHeaders() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return {
            headers: headers
        };
    }
}