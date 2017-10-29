declare var $: any;
declare var Waves: any;
declare var google: any;

import { Component, AfterViewInit, ElementRef, ViewContainerRef, ComponentRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'set-location-modal',
  templateUrl: './set-location-modal.component.html',
  styleUrls: ['./set-location-modal.component.css']
})
export class SetLocationModalComponent implements AfterViewInit {

    componentRef: ComponentRef<SetLocationModalComponent>;
    onLocationSelected: EventEmitter<any> = new EventEmitter<any>();
    autocomplete: any;
    private place: any;

    constructor(private elementRef: ElementRef, private view: ViewContainerRef) {}

    ngAfterViewInit() {
        Waves.displayEffect();
       $(this.elementRef.nativeElement.querySelector('.modal')).modal({
           complete: this.close.bind(this)
       });

       this.autocomplete = new google.maps.places.Autocomplete(
           this.elementRef.nativeElement.querySelector('#locateme'),
           {types: ['geocode']}
       );

       this.autocomplete.addListener('place_changed', this.choose.bind(this));
    }

    choose() {
        this.place = this.autocomplete.getPlace();
    }

    confirm() {
        if (this.place) {
            this.onLocationSelected.emit({
                coords: {
                    latitude: this.place.geometry.location.lat(),
                    longitude: this.place.geometry.location.lng()
                }
            });
        }
    }

    close() {
        this.componentRef.hostView.destroy();
    }
}
