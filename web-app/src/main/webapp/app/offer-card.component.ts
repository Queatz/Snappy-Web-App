import { Component, View, Input, AfterViewInit, ElementRef } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';
import { Observable } from 'rxjs/Observable';

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
    @Input() public offer;
    @Input() public resizeCallback;
    @Input() public profile;
    private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
 	filesToUpload: Array<File>;	
 	
	constructor(http: Http, element: ElementRef) {
        this.http = http;
        this.element = element.nativeElement;   
        this.filesToUpload = [];     
    }
    ngAfterViewInit() {
        Waves.displayEffect(); 
        console.log(checkFirst);
      if(this.isProfile() && this.position == 0 && checkFirst){
      	checkFirst = false;
		$('.modal-trigger').leanModal();
      }
    }
    
    public getPrice() {
        var offer = this.offer;
        var str;
        if (offer.price < 0) {
            str = 'Make $' + Math.abs(offer.price);
        } else if (offer.price === 0) {
            return 'Free';
        } else if (offer.price > 0) {
            str = '$' + offer.price
        } else {
            return 'Ask';
        }

        if (offer.unit) {
            str = str + '/' + offer.unit;
        }

        return str;
    }

    public isRequest() {
        return this.offer.price != null && this.offer.price < 0;
    }

    public getOfferTypeText() {
        if(this.isRequest()) {
            return this.offer.person.firstName + ' wants';
        } else {
            return this.offer.person.firstName + ' offers';
        }
    }

    public loaded() {
        this.resizeCallback();
    }

    public getPosition() {
    	return this.position;
    }
    
    public isProfile() {
    	if(this.profile == true)
    		return true;
    	else return false;    	
    }
    
    public deleteOffer() {
    	if(this.offer) {
    	    this.http.delete('http://queatz-snappy.appspot.com/api/me/offers/' + this.offer.id)
	            .map((res: Response) => res.json())
	            .subscribe(dataInput => {            	
	               console.log(dataInput);
	            });
	    }
    }
    public uploadPhoto() {
    	console.log(this.offer);
    	var creds = "auth=" + this.token;
    	this.makeFileRequest("http://queatz-snappy.appspot.com/api/offer/"+ this.offer.id + "/photo", [], this.filesToUpload).then((result) => {
            console.log(result);
        }, (error) => {
            console.error(error);
        });
    }
    
    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append("auth", this.token);
            formData.append("photo", files[0], files[0].name);            
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }              
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }
    
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>> fileInput.target.files;
        console.log(this.filesToUpload);
    }
    
}
