import { Injectable } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { InforService } from './infor.service';

@Injectable()
export public class ApiService {
    private _token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
    private _apiBaseUrl = 'http://queatz-snappy.appspot.com/api/';

    constructor(private _http: Http, private inforService: InforService) {
        // XXX TODO graduate it when the app is updated
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

        return this._http.get(this._apiBaseUrl + 'earth/me?' + creds)
                .map((res: Response) => res.json());
    }

    public earthThing(id: String) {
        return this._http.get(this._apiBaseUrl + 'earth/' + id + '?auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public earthCreate(params) {
        var data = 'auth=' + this.token();

        for (var key in params) {
            data += '&' + key + '=' + encodeURI(params[key]);
        }

        return this._http.post(this._apiBaseUrl + 'earth', data, this.formHeaders())
            .map((res: Response) => res.json());
    }

    public earthEdit(id: String, params) {
        var data = 'auth=' + this.token();

        for (var key in params) {
            data += '&' + key + '=' + encodeURI(params[key]);
        }

        return this._http.post(this._apiBaseUrl + 'earth/' + id, data, this.formHeaders());
    }

    public earthPhotoUrl(id: String) {
        return this._apiBaseUrl + 'earth/' + id + '/photo?s=800&auth=' + this.token();
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

    // XXX currently returns a promise, so must use .then()
    public earthPostUpdate(thingId: String, message: String, photoFile: File) {
        var formData = new FormData();

        if (photoFile) {
            formData.append('photo', photoFile, photoFile.name);
        }

        formData.append('thing', thingId);

        if (message) {
            formData.append('message', message);
        }

        var headers = new Headers();
        headers.append('Content-Type', undefined);

        return this.makeFilePostRequest(this._apiBaseUrl + 'earth?kind=update&auth=' + this.token(), formData);
    }

    public earthHere(coords, kind: String) {
        return this._http.get(this._apiBaseUrl + 'earth/here/' + kind
                                + '?latitude=' + coords.latitude
                                + '&longitude=' + coords.longitude
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

    public personMessages(personId) {
        return this._http.get(this._apiBaseUrl + 'earth/' + personId
                              + '/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public newOffer(details, price, unit) {
        var creds = "auth=" + this.token() + "&details=" + encodeURI(details) + "&price=" + encodeURI(price) + "&unit=" + encodeURI(unit);
        return this._http.post(this._apiBaseUrl + 'earth/me/offers', creds, this.formHeaders()).map((res: Response) => res.json());
    }

    public earthDelete(id: string) {
        return this._http.post(this._apiBaseUrl + 'earth/' + id + '/delete?auth=' + this.token());
    }

    public earthDeletePhoto(id: string) {
        return this._http.post(this._apiBaseUrl + 'earth/' + id + '/photo/delete?auth=' + this.token());
    }

    public earthImageUrl(id: string) {
        return this._apiBaseUrl + 'earth/' + id + '/photo?s=800&auth=' + this.token();
    }

    public sendMessage(personId, message) {
        var creds = "auth=" + this.token() + "&message=" + message;

        return this._http.post(this._apiBaseUrl + 'earth/' + personId, creds, this.formHeaders())
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