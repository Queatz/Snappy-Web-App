import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InforService } from './infor.service';
import { throwError } from 'rxjs';

@Injectable()
export class ApiService {
    private _token = '';
    private beta = true;
    private _apiDomain = this.beta ? '127.0.0.1:8080' : 'vlllage.com:8443';
    private _apiBase = this.beta ? 'http://' + this._apiDomain : 'https://' + this._apiDomain;
    private _apiBaseUrl = this._apiBase + '/api/';

    constructor(private _http: HttpClient, private inforService: InforService) {
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
        var creds = 'email=' + gemail + '&select=' + ApiService.SELECT_ME;

        this._token = gtoken;

        return this._http.get<any>(this._apiBaseUrl + 'earth/me?' + creds);
    }

    public earthThing(id: string, select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/' + id + '?' + (select ? 'select=' + select : ''));
    }

    public earthCreate(params, asPromise = false) {
        var data = '';

        for (var key in params) {
            if (key === 'photo') {
                continue;
            }

            data += (data ? '&' : '') + key + '=' + encodeURIComponent(params[key]);
        }

        var formData = null;

        if (params.photo) {
            formData = new FormData();

            formData.append('photo', params.photo, params.photo.name);
        }

        // If nothing was specified to add this to, add it to the current user so that it doesn't
        // get disassociated and lost.
        if (!params['in']) {
            let userId = this.inforService.getId();
            if (userId) {
                params['in'] = userId;
            }
        }

        if (!params.select) {
            params.select = ApiService.SELECT_THING_2;
        }

        if (!asPromise) {
            return this._http.post<any>(this._apiBaseUrl + 'earth', data, this.formHeaders());
        } else {
            return this.makeFilePostRequest(this._apiBaseUrl + 'earth?' + data, formData);
        }
    }

    public earthEdit(id: string, params) {
        var data = '';

        for (var key in params) {
            data += (data ? '&' : '') + key + '=' + encodeURIComponent(params[key]);
        }

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + id, data, this.formHeaders());
    }

    public earthPhotoUrl(id: string): string {
        return this.earthImageUrl(id, 1200);
    }

    public getPhotoUrlFor(thing: any, sz: number) {
        if (!thing) {
            return 'img/night.png';
        }

        switch (thing.kind) {
            case 'person':
                return thing.imageUrl.split('=')[0] + '=' + (thing.imageUrl.indexOf('?') === -1 ? 's' + sz : sz);
            default:
                if (thing.photo) {
                    return this.earthImageUrl(thing.id, sz);
                } else {
                    return 'img/night.png';
                }
        }
    }

    public changeCoverPhoto(thingId: string) {
        const me = this.inforService.getInforUser();

        if (!me) {
            return throwError('No user');
        }

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + me.id, 'cover=' + thingId, this.formHeaders());
    }

    public earthPutPhoto(id: string, photoFile: File) {
        var formData = new FormData();
        formData.append('photo', photoFile, photoFile.name);

        return this.makeFilePostRequest(this.earthPhotoUrl(id), formData);
    }

    public earthPostUpdate(thingId: string, message: string, photoFile: File = null, visibility: any = null, withAt: any[] = null, going: boolean = null) {
        var formData = new FormData();

        if (photoFile) {
            formData.append('photo', photoFile, photoFile.name);
        }

        if (message) {
            formData.append('message', message);
        }

        if (thingId) {
            formData.append('in', thingId);
        }

        if (visibility) {
            formData.append('hidden', visibility.hidden);
            formData.append('clubs', visibility.clubs);
        }

        if (withAt) {
            formData.append('with', JSON.stringify(withAt));
        }

        if (going !== null) {
            formData.append('going', going.toString());
        }

        return this._http.post<any>(this._apiBaseUrl + 'earth?kind=update', formData, {
            headers: {
                'Content-Type': undefined
            }
        });
    }

    public completeGoal(goalId: string, params: any): any {
        var formData = new FormData();

        if (params.photo) {
            formData.append('photo', params.photo, params.photo.name);
        }

        if (params.message) {
            formData.append('message', params.message);
        }

        if (params.with) {
            formData.append('with', JSON.stringify(params.with));
        }

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + goalId + '/complete', formData, {
            headers: {}
        });
    }

    public earthSaveUpdate(updateId: string, message: string, photoFile: File, visibility: any, withAt: any[] = null) {
        var formData = new FormData();

        if (photoFile) {
            formData.append('photo', photoFile, photoFile.name);
        }

        if (message) {
            formData.append('message', message);
        }

        if (visibility) {
            formData.append('hidden', visibility.hidden);
            formData.append('clubs', visibility.clubs);
        }

        if (withAt) {
            formData.append('with', JSON.stringify(withAt));
        }

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + updateId, formData, {
            headers: {}
        });
    }

    public earthHere(coords, kind: string, select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/here/' + encodeURIComponent(kind)
                                + '?latitude=' + coords.latitude
                                + '&longitude=' + coords.longitude
                                + (select ? '&select=' + select : ''));
    }

    public earthSearch(coords, q: string, kind: string, select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/search' + (kind ? '/' + encodeURIComponent(kind) : '')
                                + '?latitude=' + coords.latitude
                                + '&longitude=' + coords.longitude
                                + (select ? '&select=' + select : '')
                                + '&q=' + encodeURIComponent(q));
    }

    public setSeen(personId) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/' + personId + '?seen=true');
    }

    public getPersonByName(personName: string, select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/by-name/' + personName + '?' + (select ? 'select=' + select : ''));
    }

    public messages(select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/me/messages?' + (select ? 'select=' + select : ''));
    }

    public clubs(select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/me/clubs?' + (select ? 'select=' + select : ''));
    }

    public saveAbout(about: string) {
        return this._http.post<any>(this._apiBaseUrl + 'earth/me/?about=' + encodeURIComponent(about), '');
    }

    public saveMyLink(myLink: string) {
        return this._http.post<any>(this._apiBaseUrl + 'earth/me/?link=' + encodeURIComponent(myLink), '');
    }

    public saveMyLinkPrecheck(myLink: string) {
        return this._http.post<any>(this._apiBaseUrl + 'earth/me/?link_precheck=' + encodeURIComponent(myLink), '');
    }

    public personMessages(personId: string, select: string = null) {
        return this._http.get<any>(this._apiBaseUrl + 'earth/' + personId
                              + '/messages?' + (select ? 'select=' + select : ''));
    }

    public newOffer(details, price, unit, asMemberOf = null, want = false, visibility = null) {
        var creds = 'details=' + encodeURIComponent(details) +
        '&price=' + encodeURIComponent(price) +
        '&unit=' + encodeURIComponent(unit) +
        (
            visibility ? '&hidden=' + visibility.hidden + '&clubs=' + encodeURIComponent(visibility.clubs) : ''
        ) +
        '&want=' + encodeURIComponent(want.toString()) +
        '&kind=offer' +
        (asMemberOf ? '&in=' + encodeURIComponent(asMemberOf.id) : '');
        return this._http.post<any>(this._apiBaseUrl + 'earth', creds, this.formHeaders());
    }

    public editOffer(offerId, details, price, unit, want, visibility) {
        var creds = 'details=' + encodeURIComponent(details) +
            '&price=' + encodeURIComponent(price) +
            '&unit=' + encodeURIComponent(unit) +
            (
                visibility ? '&hidden=' + visibility.hidden + '&clubs=' + encodeURIComponent(visibility.clubs) : ''
            ) +
            '&want=' + encodeURIComponent(want);
        return this._http.post<any>(this._apiBaseUrl + 'earth/' + offerId, creds, this.formHeaders());
    }

    public earthDelete(id: string) {
        return this._http.post<any>(this._apiBaseUrl + 'earth/' + id + '/delete', '');
    }

    public earthDeletePhoto(id: string) {
        return this._http.post<any>(this._apiBaseUrl + 'earth/' + id + '/photo/delete', '');
    }

    public earthImageUrl(id: string, size: Number = 800) {
        return this._apiBaseUrl + 'earth/' + id + '/photo?s=' + size;
    }

    public sendMessage(personId, message, select: string = null) {
        var creds = 'message=' + encodeURIComponent(message) + (select ? '&select=' + select : '');

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + personId, creds, this.formHeaders());
    }

    public sendPhotoMessage(personId: string, message: string, photoFile: File) {
        var formData = new FormData();

        if (photoFile) {
            formData.append('photo', photoFile, photoFile.name);
        }

        if (message) {
            formData.append('message', message);
        }

        return this.makeFilePostRequest(this._apiBaseUrl + 'earth/' + personId + '/message', formData);
    }

    public sendFeedback(feedback) {
        var creds = 'feedback=' + encodeURIComponent(feedback);

        return this._http.post<any>(this._apiBaseUrl + 'earth/feedback', creds, this.formHeaders());
    }

    public subscribeToLocality(coords: any, locality: string, email: string) {
        var data = 'latitude=' + coords.latitude +
                   '&longitude=' + coords.longitude +
                   '&name=' + encodeURIComponent(locality) +
                   '&email=' + encodeURIComponent(email);

        return this._http.post<any>(this._apiBaseUrl + 'earth/geo-subscribe', data, this.formHeaders());
    }

    public follow(personId: string, follow: boolean) {
        var creds = 'follow=' + follow + '&select=backing,backers,target(backing,backers)';

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + personId, creds, this.formHeaders());
    }

    public like(id: string) {
        return this._http.post<any>(this._apiBaseUrl + 'earth/' + id + '/like', '', this.formHeaders());
    }

    public join(thingId: string, join: boolean) {
        var creds = 'join=' + join + '&select=joins(source)';

        return this._http.post<any>(this._apiBaseUrl + 'earth/' + thingId, creds, this.formHeaders());
    }

    public getAppToken(domain: string) {
        var creds = 'domain=' + encodeURIComponent(domain);

        return this._http.get<any>(this._apiBaseUrl + 'earth/app/token?' + creds);
    }

    public submitForm(formId: string, files: Map<string, File>, photos: Map<string, File>, data: any) {
        var formData = new FormData();

        if (!formId) {
            return;
        }

        if (!data) {
            return;
        }

        formData.append('in', formId);
        formData.append('data', JSON.stringify(data));

        for(let photo in photos) {
            formData.append('photo---' + photo, photos[photo]);
        }

        for(let file in files) {
            formData.append('file---' + file, files[file]);
        }

        return this.makeFilePostRequest(this._apiBaseUrl + 'earth?kind=form-submission', formData);
    }

    private makeFilePostRequest(url: string, formData: FormData) {
        return this._http.post<any>(url, formData, {
            headers: {
                ['Content-Type']: 'multi-part/formdata; charset=UTF-8'
            }
        });
    }

    private formHeaders() {
        return {
            headers: {
                ['Content-Type']: 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
    }

    /* Selection Queries */

    public static SELECT_CLUBS = 'name,about,photo';
    public static SELECT_FORM = 'name,about,data,photo';

    public static SELECT_THING = ApiService.s(`
        message,
        token,
        data,
        type,
        role,
        date,
        firstName,
        hidden,
        lastName,
        googleUrl,
        imageUrl,
        name,
        going,
        action,
        photo,
        liked,
        likers,
        likes(
            source(
                firstName,
                lastName,
                imageUrl,
                googleUrl
            )   
        ),
        in(
            target(
                name,
                photo,
                firstName,
                lastName,
                imageUrl,
                googleUrl
            )
        ),
        joins(
            source(
                name,
                firstName,
                lastName,
                photo,
                imageUrl,
                googleUrl
            )
        ),
        about,
        target(
            name,
            photo,
            firstName,
            lastName,
            googleUrl,
            imageUrl,
            around,
            infoDistance
        ),
        source(
            photo,
            name,
            imageUrl,
            googleUrl,
            firstName,
            lastName
        ),
        members(
            source(
                about,
                name,
                photo,
                date,
                source(
                    name,
                    photo,
                    firstName,
                    lastName,
                    imageUrl,
                    googleUrl
                )
            )
        ),
        clubs(
            name
        )
    `);

    public static SELECT_THING_2 = ApiService.s(`
        name,
        photo,
        about,
        address,
        hidden,
        geo,
        infoDistance,
        data,
        members(
            role,
            source(
                message,
                token,
                data,
                type,
                role,
                date,
                firstName,
                hidden,
                lastName,
                googleUrl,
                imageUrl,
                name,
                photo,
                going,
                action,
                want,
                liked,
                likers,
                likes(
                    source(
                        firstName,
                        lastName,
                        imageUrl,
                        googleUrl
                    )
                ),
                about,
                in(
                    target(
                        name,
                        photo,
                        firstName,
                        lastName,
                        imageUrl,
                        googleUrl
                    )
                ),
                target(
                    firstName,
                    lastName,
                    googleUrl,
                    imageUrl,
                    around,
                    infoDistance
                ),
                source(
                    imageUrl,
                    googleUrl,
                    firstName,
                    lastName
                ),
                clubs(
                    name
                )
            ),
            target(
                name,
                owner,
                imageUrl,
                googleUrl,
                photo,
                firstName,
                lastName,
                about
            )
        ),
        clubs(
            name
        )
    `);
    
    public static SELECT_HOME = ApiService.s(`
        date,
        photo,
        about,
        action,
        going,
        want,
        owner,
        likers,
        liked,
        likes(
            source(
                firstName,
                lastName,
                imageUrl,
                googleUrl
            )
        ),
        members(
            source(
                about,
                date,
                likers,
                liked,
                likes(
                    source(
                        firstName,
                        lastName,
                        imageUrl,
                        googleUrl
                    )
                ),
                source(
                    name,
                    firstName,
                    lastName,
                    imageUrl,
                    googleUrl
                )
            )
        ),
        in(
            target(
                name,
                photo,
                firstName,
                lastName,
                imageUrl,
                googleUrl
            )
        ),
        joins(
            target(
                name,
                firstName,
                lastName,
                googleUrl,
                imageUrl,
                photo
            ),
            source(
                name,
                firstName,
                imageUrl,
                photo,
                lastName,
                imageUrl,
                googleUrl
            )
        ),
        source(
            imageUrl,
            googleUrl,
            firstName,
            lastName
        ),
        target(
            name,
            photo,
            firstName,
            lastName,
            imageUrl,
            googleUrl
        ),
        clubs(
            name
        )
    `);

    public static SELECT_PERSON = ApiService.s(`
        firstName,
        lastName,
        imageUrl,
        googleUrl,
        infoDistance,
        around,
        hidden,
        backing,
        backers,
        backs(
            source(
                firstName,
                lastName,
                imageUrl,
                googleUrl
            )
        ),
        photo,
        cover,
        about,
        members(
            role,
            source(
                date,
                name,
                firstName,
                lastName,
                imageUrl,
                photo,
                about,
                hidden,
                owner,
                going,
                action,
                want,
                liked,
                likers,
                likes(
                    source(
                        firstName,
                        lastName,
                        imageUrl,
                        googleUrl
                    )
                ),
                members(
                    source(
                        name,
                        photo,
                        about,
                        firstName,
                        lastName,
                        imageUrl,
                        date,
                        likers,
                        liked,
                        likes(
                            source(
                                firstName,
                                lastName,
                                imageUrl,
                                googleUrl
                            )
                        ),
                        source(
                            name,
                            photo,
                            firstName,
                            lastName,
                            imageUrl,
                            googleUrl
                        ),
                        target(
                            name,
                            photo,
                            firstName,
                            lastName,
                            imageUrl,
                            googleUrl
                        )
                    )
                ),
                in(
                    target(
                        name,
                        photo,
                        firstName,
                        lastName,
                        imageUrl,
                        googleUrl
                    )
                ),
                joins(
                    source(
                        name,
                        firstName,
                        lastName,
                        photo,
                        imageUrl,
                        googleUrl
                    )
                ),
                source(
                    imageUrl,
                    googleUrl,
                    photo,
                    firstName,
                    lastName
                ),
                target(
                    name,
                    photo,
                    firstName,
                    lastName,
                    imageUrl,
                    googleUrl
                ),
                clubs(
                    name
                )
            ),
            target(
                name,
                owner,
                imageUrl,
                googleUrl,
                photo,
                firstName,
                lastName,
                about
            )
        ),
        clubs(
            name
        )
    `);
    
    public static SELECT_THINGS = 'name,about,hidden,photo,infoDistance,in(target(name,photo,googleUrl,imageUrl,firstName,lastName)),clubs(name)';
    public static SELECT_THINGS_WITH_MEMBERS = 'name,about,hidden,photo,infoDistance,members(source(name,photo,googleUrl,imageUrl,firstName,lastName,source(name,photo,googleUrl,imageUrl,firstName,lastName),target(name,photo,googleUrl,imageUrl,firstName,lastName))),in(target(name,photo,googleUrl,imageUrl,firstName,lastName)),clubs(name)';
    public static SELECT_PEOPLE = 'googleUrl,imageUrl,infoDistance,around,firstName,lastName,about,clubs(name)';
    public static SELECT_PEOPLE_MINIMAL = 'name,photo,about,firstName,lastName,imageUrl,googleUrl,around,infoDistance';
    public static SELECT_PERSON_MINIMAL = 'firstName,lastName,imageUrl';

    public static SELECT_ME = 'auth,googleUrl,imageUrl,firstName,lastName,modes(source),clubs(name)';
    
    public static SELECT_SEARCH = 'name,about,photo,imageUrl,firstName,lastName,googleUrl,infoDistance';
    public static SELECT_MESSAGES = 'latest,seen,updated,firstName,lastName,photo,message,source(firstName,lastName,googleUrl,imageUrl),target(firstName,lastName,googleUrl,imageUrl)';
    public static SELECT_PERSON_MESSAGES = 'date,photo,message,source(firstName,lastName,googleUrl,imageUrl),target(firstName,lastName,googleUrl,imageUrl)';

    private static s(s: string) {
        return s.replace(/\s+/g, '');
    }
}