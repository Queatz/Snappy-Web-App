declare var Waves: any;
declare var _: any;
declare var $: any;
declare var Materialize: any;

import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ComponentRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';
import { UiService } from '../ui.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'thing-preview',
  templateUrl: './thing-preview.component.html',
  styleUrls: ['./thing-preview.component.css']
})
export class ThingPreviewComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() thing: any;

  constructor(
    private api: ApiService,
    private info: InforService,
    private ui: UiService,
    private elementRef: ElementRef,
    private router: Router) { }

  ngOnInit() {
    if (this.thing.kind === 'member') {
      this.thing.source.member = this.thing;
      this.thing = this.thing.source;
    }

    if (this.thing.members) {
      _.remove(this.thing.members, m => m.source.kind !== 'update');
    }
  }

  ngAfterViewInit() {
    Waves.displayEffect();
    $(this.elementRef.nativeElement).find('.tooltipped').tooltip({enterDelay: 50, exitDelay: 25});
  }

  ngOnDestroy() {
    $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
  }

  isMember(): boolean {
    if (!this.info.getInforUser()) {
      return false;
    }

    let me = this.info.getInforUser().id;
    return this.thing.member && this.thing.member.target && this.thing.member.target.id === me;
  }

  removeMember() {
    let modal: ConfirmationModalComponent = this.ui.show(ConfirmationModalComponent).instance;
    modal.message = 'Leave ' + this.thing.name + '?';
    modal.color = 'red';
    modal.positiveButton = 'Leave ' + this.thing.kind;

    modal.onConfirm.subscribe(() => {
      this.api.earthDelete(this.thing.member.id).subscribe(
        () => {
          Materialize.toast('Left ' + this.thing.name);
        }
      );
    });
  }

  action() {
    if (!this.info.getInforUser()) {
      Materialize.toast('Sign in', 4000);
    }

    if (this.joined()) {
      this.router.navigate(['/', 'goals', this.thing.id, 'complete']);
      return;
    }

    this.api.earthCreate({
      kind: 'member',
      source: this.thing.id,
      target: this.info.getInforUser().id,
      select: 'role'
    }).subscribe(() => {
      Materialize.toast('Joined ' + this.thing.name, 4000);
    });
  }

  joined() {
    return this.info.getInforUser() && _.any(this.thing.in, j => j.target.id === this.info.getInforUser().id);
  }

}
