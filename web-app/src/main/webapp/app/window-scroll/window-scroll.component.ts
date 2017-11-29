declare var $: any;

import { Component, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'window-scroll',
  template: '<ng-content></ng-content>',
  styles: [':host { display: block; }']
})
export class WindowScrollComponent {
  
  private expander: any;
  @Output() onBottomReached = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  public onWindowScroll(event: Event) {
      if (this.expander) {
          return;
      }

      if (document.body.clientHeight > window.pageYOffset + window.innerHeight * 1.5) {
          return;
      }

      if (!$(this.elementRef.nativeElement).is(':visible')) {
          return;
      }

      this.expander = setTimeout(() => {
          this.onBottomReached.emit();
          this.expander = null;
      });
  }

}
