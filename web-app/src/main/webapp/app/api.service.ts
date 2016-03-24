import { Injectable } from 'angular2/core';
import { Http, Headers } from 'angular2/http';
import { InforService } from './infor.service';

@Injectable()
export public class ApiService {
    private _token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';

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

    public here(coords) {
        return this._http.get('http://queatz-snappy.appspot.com/api/here?latitude='
                              + coords.latitude + '&longitude='
                              + coords.longitude
                              + '&auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public peopleHere(coords) {
        return this._http.get('http://queatz-snappy.appspot.com/api/here/people?latitude='
                              + coords.latitude + '&longitude='
                              + coords.longitude
                              + '&auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public setSeen(personId) {
        return this._http.get('http://queatz-snappy.appspot.com/api/people/' + personId + '?seen=true'
                              + '&auth='+ this.token())
                           .map((res: Response) => res.json());
    }

    public getPerson(personId) {
        return this._http.get('http://queatz-snappy.appspot.com/api/people/' + personId
                              + '?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public messages() {
        return this._http.get('http://queatz-snappy.appspot.com/api/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public personMessages(personId) {
        return this._http.get('http://queatz-snappy.appspot.com/api/people/' + personId
                              + '/messages?auth=' + this.token())
                           .map((res: Response) => res.json());
    }

    public sendMessage(personId, message) {
        var creds = "auth=" + this.token() + "&message=" + message;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post('http://queatz-snappy.appspot.com/api/people/' + personId, creds, {
            headers: headers
        })
            .map(res => res.json());
    }
}