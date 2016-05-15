import { Injectable } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { InforService } from './infor.service';

@Injectable()
export public class ApiService {
    private _token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
    private _apiBaseUrl = 'http://queatz-snappy.appspot.com/api/';

    constructor(private _http: Http, private inforService: InforService) {
        this._apiBaseUrl = 'https://beta-dot-queatz-snappy.appspot.com/api/';
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

    public getMe(gemail: string, gtoken: string) {
        var creds = 'email=' + gemail + '&auth=' + gtoken;

        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/me?' + creds)
                .map((res: Response) => res.json());
    }

    public earthThing(id: String) {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/' + id + '?auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public earthCreate(params) {
        var data = 'auth=' + this.token();

        for (var key in params) {
            data += '&' + key + '=' + encodeURI(params[key]);
        }

        return this._http.post(this._apiBaseUrl + 'temporary-earth-logic', data, this.formHeaders())
            .map((res: Response) => res.json());
    }

    public earthEdit(id: String, params) {
        var data = 'auth=' + this.token();

        for (var key in params) {
            data += '&' + key + '=' + encodeURI(params[key]);
        }

        return this._http.post(this._apiBaseUrl + 'temporary-earth-logic/' + id, data, this.formHeaders());
    }

    public earthPhotoUrl(id: String) {
        return this._apiBaseUrl + 'temporary-earth-logic/' + id + '/photo?s=800&auth=' + this.token();
    }

    // XXX currently returns a promise, so must use .then()
    public earthPutPhoto(id: String, photoFile: File) {
        var formData = new FormData();
        formData.append('photo', photoFile, photoFile.name);

        var headers = new Headers();
        headers.append('Content-Type', undefined);

        return this.makeFilePostRequest(this.earthPhotoUrl(id), formData);
    }

    public earthDeletePhoto(id: String) {
        return this._http.post(this.earthPhotoUrl(id));
    }

    public earthHere(coords, kind: String) {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/here/' + kind
                                + '?latitude=' + coords.latitude
                                + '&longitude=' + coords.longitude
                                + '&auth='+ this.token())
                            .map((res: Response) => res.json());
    }

    public setSeen(personId) {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/' + personId + '?seen=true'
                              + '&auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public getPerson(personId) {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/' + personId
                              + '?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public getPersonByName(personName) {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/by-name/' + personName + '?auth=' + this.token())
            .map(res => res.json());
    }

    public messages() {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/me/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public personMessages(personId) {
        return this._http.get(this._apiBaseUrl + 'temporary-earth-logic/' + personId
                              + '/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public newOffer(details, price, unit) {
        var creds = "auth=" + this.token() + "&details=" + encodeURI(details) + "&price=" + encodeURI(price) + "&unit=" + encodeURI(unit);
        return this._http.post(this._apiBaseUrl + 'temporary-earth-logic/me/offers', creds, this.formHeaders()).map((res: Response) => res.json());
    }

    public deleteOffer(id: string) {
        return this._http.post(this._apiBaseUrl + 'temporary-earth-logic/' + id + '/delete?auth=' + this.token());
    }

    public deleteOfferPhoto(id: string) {
        return this._http.post(this._apiBaseUrl + 'temporary-earth-logic/' + id + '/photo/delete?auth=' + this.token());
    }

    public offerImageUrl(id: string) {
        return this._apiBaseUrl + id + 'temporary-earth-logic/' + this.offer.id + '/photo?s=800&auth=' + this.token();
    }

    public sendMessage(personId, message) {
        var creds = "auth=" + this.token() + "&message=" + message;

        return this._http.post(this._apiBaseUrl + 'temporary-earth-logic/' + personId, creds, this.formHeaders())
            .map(res => res.json());
    }

    private makeFilePostRequest(url: String, formData: FormData) {
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