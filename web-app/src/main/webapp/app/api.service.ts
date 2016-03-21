import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';
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
}