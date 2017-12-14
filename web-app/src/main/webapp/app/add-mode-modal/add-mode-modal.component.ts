declare var $: any;
declare var Waves: any;
declare var Materialize: any;

import { Component, OnInit, AfterViewInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';

@Component({
  selector: 'add-mode-modal',
  templateUrl: './add-mode-modal.component.html',
  styleUrls: ['./add-mode-modal.component.css']
})
export class AddModeModalComponent implements OnInit, AfterViewInit {

  @Output() public onComplete = new EventEmitter<any>();

  clubs = {};
  isPublic = true;
  about = '';
  name = '';

  constructor(private api: ApiService, private info: InforService, private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
      Waves.displayEffect();
      $(this.elementRef.nativeElement.querySelector('.modal')).modal({
        complete: () => this.onComplete.emit()
      });
  }

  add() {
    let me = this.info.getInforUser() && this.info.getInforUser().id;

    if (!me) {
      Materialize.toast('Sign in', 4000);
      return;
    }

    this.name = this.name.trim();
    this.about = this.about.trim();

    if (!this.name.length) {
      Materialize.toast('Enter name', 4000);
      return;
    }

    if (!this.about.length) {
      Materialize.toast('Enter description', 4000);
      return;
    }

    this.api.earthCreate({
      kind: 'mode',
      about: this.about,
      name: this.name,
      hidden: !this.isPublic,
      clubs: JSON.stringify(this.clubs),
      in: me
    }).subscribe(
      () => {
        Materialize.toast(this.name + ' on', 4000);
        $(this.elementRef.nativeElement.querySelector('.modal')).modal('close');
      },
      () => {
        Materialize.toast('That didn\'t work', 4000);
      }
    );
  }
}
