import { Component, ElementRef, provide ,AfterViewInit, OnInit } from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Http, Headers, HTTP_PROVIDERS, BaseRequestOptions, RequestOptions} from 'angular2/http';

import {InforService} from './infor.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

var firstHeaders = new Headers();
firstHeaders.append('Content-Type', 'application/json;charset=UTF-8');
var endMessage = false;


class MyOptions extends BaseRequestOptions {
  headers: Headers = firstHeaders
}

@Component({
	templateUrl: 'app/messages.component.html',
	styleUrls: ['app/messages.component.css'],
    viewProviders: [HTTP_PROVIDERS, provide(RequestOptions, {useClass: MyOptions})]	
})
export class MessagesComponent implements AfterViewInit, OnInit {
    public currentMessages = [];
    public messageWithSomeone=[];
    public contacts = [];
    public info=[];
    public idCurrentContact;
         
    constructor(inforService: InforService, private router:Router,private routeParams:RouteParams,http: Http, element: ElementRef) {
    	this.inforService = inforService;
        this.http = http;
        this.element = element.nativeElement;
        this.idCurrentContact = this.routeParams.get('id');
        
        /*this.todos$ = new Observable(observer => 
            this._todosObserver = observer).share();*/
         
           
         if(this.inforService.getInforUser()){
			this.myId = this.inforService.getInforUser().id;
    		this.token = this.inforService.getInforUser().auth;
			this.loadMessages();        	
    	}
    }

	haveUserInfor(){
		if(this.inforService.getInforUser()){        	
			return true;
		}
		return false;
	}
	
  	ngOnInit() {
  		//this.todos$.subscribe(updatedTodos => this.messageWithSomeone = updatedTodos);
  	}
      ngAfterViewInit() {
      	$('.scroll').niceScroll();
      }
    
    loadMessages(){
        this.http.get('http://queatz-snappy.appspot.com/api/messages' + '?auth=' + this.token)
            .map((res: Response) => res.json())
            .subscribe(dataInput => {
            	this.showMessages(dataInput);
            });
    }
    
    
    
    showMessages(dataInput){
    	this.currentMessages = dataInput.messages;
    	var items=[];
    	for(var i=0;i<this.currentMessages.length;i++){
    		var item = "";
    		if(this.currentMessages[i].from.id != this.myId)
    			item =   this.currentMessages[i].from.firstName ;
    		else if(this.currentMessages[i].to.id != this.myId)
    			item = this.currentMessages[i].to.firstName;    		
    		if($.inArray(item, items) == -1){
    			items.push(item);
    			this.contacts.push(this.currentMessages[i]);
    		}
    	}
    	if(this.contacts.length > 0){
    		if(this.idCurrentContact != ''){
	    		this.goToGetMessages();
	    	}else{
    			this.getMessagesById(this.contacts[0]);
    		}
    	}
    }
    
    getMessagesById(contact){
	    	if(contact.from.id != this.myId)
	    		this.idCurrentContact = contact.from.id;
	    	else
	    		this.idCurrentContact = contact.to.id;
    		this.goToGetMessages();
    }
    goToGetMessages(){
    	this.http.get('http://queatz-snappy.appspot.com/api/people/'+ this.idCurrentContact +'/messages?auth=' + this.token)
	            .map((res: Response) => res.json())
	            .subscribe(dataInput => {
	            	this.endMessage = false;
	            	$('.ms-toogle').toggleClass('ms-toogle-on');
	            	if(dataInput.error){
				   		this.messageWithSomeone = [];	               		
				    }else{
				   		this.messageWithSomeone = dataInput.reverse();               		
				    }
				    

		            //this._todosObserver.next(this.messageWithSomeone);
	            });
    }
    
    showChat(){
    	$('.ms-toogle').toggleClass('ms-toogle-on');
    }
    
    showRecent(){
    	$('.ms-toogle').toggleClass('ms-toogle-on');
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
	               		this.endMessage = false;
	               		this.messageWithSomeone.push(dataInput);	   
	               		this.strMessage= '';            		
	               	}
	            });
       }else{
       		console.log("empty input or idcontact");
       }
    }
    
    showContactImage(contact, mode){
    	if(contact.from.id == this.myId){
    		switch(mode){
    			case 0: //imageUrl
    				return contact.to.imageUrl;
    			case 1: // name
    				return contact.to.firstName+' ' + contact.to.lastName;
    			default:
    				return '';
    		}
    	}else{
    		switch(mode){
    			case 0: //imageUrl
    				return contact.from.imageUrl;
    			case 1: // name
    				return contact.from.firstName+' ' + contact.from.lastName;
    			default:
    				return '';
    		}
    	}
    }
    checkIsLeft(message){    	
    	if(message.from.id != this.myId){
    		this.showleft = true;
    		return 'true';
    	}else{
    		this.showleft = false;
    		return 'false';
    	}
    }
    
    getColor(message){  
    	if(this.messageWithSomeone.indexOf(message) == (this.messageWithSomeone.length-1))  	
    		return 'gray';
    	else
    		return 'rgba(0,0,0,0.87)';
    }
    showContentMessage(message, mode){    	
    	if(this.messageWithSomeone.indexOf(message) == (this.messageWithSomeone.length-1) && !this.endMessage){
    		$('.content').animate({scrollTop:$('.scrollpanel').height()}, 'slow');
    		this.endMessage = true;    		
    	}
    	switch(mode){	    		
    		case 0: //show message
    			return message.message;
    		case 1: //show image
    			return message.from.imageUrl;
    		default:
    			return '';
    	}
    	
    }    
}
