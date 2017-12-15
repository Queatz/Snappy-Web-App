declare var $: any;
declare var Waves: any;

import { Component, OnInit, Output, Input, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  @Output() public onComplete = new EventEmitter<any>();
  @Output() public onConfirm = new EventEmitter<any>();
  @Input() public message: string;
  @Input() public color: string;
  @Input() public positiveButton: string;
  @Input() public negativeButton: string;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
      Waves.displayEffect();
      $(this.elementRef.nativeElement.querySelector('.modal')).modal({
        complete: () => this.onComplete.emit()
      });
  }

  confirm() {
    $(this.elementRef.nativeElement.querySelector('.modal')).modal('close');
    this.onConfirm.emit();
  }

}
