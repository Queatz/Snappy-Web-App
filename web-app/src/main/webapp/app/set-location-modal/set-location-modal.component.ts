declare var $: any;
declare var Waves: any;
declare var Materialize: any;
declare var google: any;

import { Component, AfterViewInit, ElementRef, ViewContainerRef, ComponentRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'set-location-modal',
  templateUrl: './set-location-modal.component.html',
  styleUrls: ['./set-location-modal.component.css']
})
export class SetLocationModalComponent implements AfterViewInit {

    @Output() public onComplete = new EventEmitter<any>();
    
    onLocationSelected: EventEmitter<any> = new EventEmitter<any>();
    autocomplete: any;
    private place: any;

    constructor(private elementRef: ElementRef, private view: ViewContainerRef) {}

    ngAfterViewInit() {
        Waves.displayEffect();

        $(this.elementRef.nativeElement.querySelector('.modal')).modal({
            complete: () => this.onComplete.emit()
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
            let toast = $('<span>')
                .text('Location set to ' + this.place.name)
                .add($('<button class="btn-flat toast-action">Undo</button>').click(() => {
                    toast.parent()[0].M_Toast.remove();
                    this.onLocationSelected.emit(null);
                }));

            Materialize.toast(toast, 4000);

            this.onLocationSelected.emit({
                coords: {
                    latitude: this.place.geometry.location.lat(),
                    longitude: this.place.geometry.location.lng()
                }
            });
        }
    }
}
