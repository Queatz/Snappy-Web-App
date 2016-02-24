import { Component, OnInit, ElementRef, provide ,OnChanges } from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');

class MyOptions extends BaseRequestOptions {
  headers: Headers = firstHeaders
}

@Component({
	templateUrl: 'app/messages.component.html',
	styleUrls: ['app/messages.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})]	
})
export class MessagesComponent implements OnInit {
    private token = 'ya29.OwK_gZu6kwBy5Q_N5GkTZvVC1aNJinY4mNl9i3P2joKaXt5UqdFbXusCu0wW1CExbzlEX1U';
     public currentMessages = [];
     public contacts = [];
     public info=[];
     public idCurrentContact;
    constructor(private router:Router,private routeParams:RouteParams,http: Http, element: ElementRef) {
        this.http = http;
        this.element = element.nativeElement;        
    }

    ngOnInit() {
    	this.loadMessages();
    }
    loadMessages(){
        this.http.get('http://queatz-snappy.appspot.com/api/messages' + '?auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(dataInput => {
               this.showMessages(dataInput);
            });
    }
    public ngOnChanges() {
     	console.log("data thay doi");
    }
    showMessages(dataInput){
    	this.currentMessages = dataInput.messages;
    	console.log(this.currentMessages);
    	var items=[];
    	for(var i=0;i<this.currentMessages.length;i++){
    		var item = "";
    		if(this.currentMessages[i].from.id != "6717781510251571172")
    			item =   this.currentMessages[i].from.firstName ;
    		else if(this.currentMessages[i].to.id != "6717781510251571172")
    			item = this.currentMessages[i].to.firstName;
    		
    		if($.inArray(item, items) == -1){
    			items.push(item);
    			this.contacts.push(this.currentMessages[i]);
    		}
    	}
    	console.log(this.contacts);
    }
    getMessagesById(contact){
    	console.log(contact);
    	
    	if(contact.from.id != "6717781510251571172")
    		this.idCurrentContact = contact.from.id;
    	else
    		this.idCurrentContact = contact.to.id;
    		this.http.get('http://queatz-snappy.appspot.com/api/people/'+ this.idCurrentContact +'/messages?auth=' + this.token)
	            .map((res: Response) => res.json())
	            .subscribe(dataInput => {            	
	               if(dataInput.error){
	               		this.currentMessages = [];
	               }else{
	               		this.currentMessages =dataInput.reverse();               		
	               }
	            });
    }
    sendMessages(message){
    	if(this.idCurrentContact && typeof message !== 'undefined' && message != ""){
	    	var creds = "auth=" + this.token+ "&message=" + message;
			var headers = new Headers();
			headers.append('Content-Type', 'application/x-www-form-urlencoded');		
			
			this.http.post('http://queatz-snappy.appspot.com/api/people/'+this.idCurrentContact, creds, {
			    headers: headers
			    })
			    .map(res => res.json())
			    .subscribe(dataInput => {
	               if(dataInput.message == message){
	               		this.currentMessages.push(dataInput);
	               	}
	            });
       }else{
       		console.log("empty input or idcontact");
       }
    }
}
