import { Component, ElementRef, provide ,OnChanges } from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
  headers: Headers = firstHeaders
}
@Component({
    selector: 'floating',
    templateUrl: 'app/floating.component.html',
	styleUrls: ['app/floating.component.css'],
	viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})]
})
export class FloatingComponent implements AfterViewInit {
	 private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
    constructor(private router:Router,private routeParams:RouteParams,http: Http, element: ElementRef) {
        this.http = http;
        this.element = element.nativeElement;        
    }
     
     newOffer(emessage, enumber){
     	console.log(emessage);
     	console.log(enumber);
     	var number = parseInt(enumber);
     	if(typeof emessage !== 'undefined' && emessage != "" && number > 0){
	    	var creds = "auth=" + this.token+ "&details=" + emessage + "&price="+number;
			
			var headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded');		
			this.http.post('http://queatz-snappy.appspot.com/api/me/offers', creds, {
			    headers: headers
			    })
			    .map(res => res.json())
			    .subscribe(dataInput => {
	               console.log(dataInput);
	            });
       }else{
       		console.log("empty input or offer");
       }
     }
}
