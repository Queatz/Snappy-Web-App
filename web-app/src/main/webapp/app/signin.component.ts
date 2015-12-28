import {Component, AfterViewInit, ElementRef, Inject} from 'angular2/core';

@Component({
    selector: 'signin',
    template: '<div class="signin-wrapper secondary-content"><div></div></div>',
    styles: ['.signin-wrapper { padding: 1rem; line-height: initial; }']
})
export class SigninComponent implements AfterViewInit {
    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement.children[0];
        this.signedIn = false; // todo -> auth factory
    }

    ngAfterViewInit() {
        gapi.signin2.render(this.element, {
            onsuccess: (googleUser) => {
                this.onSuccess(googleUser);
                this.signedIn = true;
            },
            onfailure: (error) => {
                console.log(error);
            },
            scope: 'profile email',
            redirect_uri: 'http://localhost:3000' //todo
        });
    }

    public onSuccess(googleUser) {
        console.log(googleUser);
    }
}
