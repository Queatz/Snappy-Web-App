declare var Waves: any;
declare var _: any;
declare var $: any;
declare var Materialize: any;

import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { InforService } from '../infor.service';

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
    private elementRef: ElementRef,
    private router: Router) { }

  ngOnInit() {
    if (this.thing.kind === 'member') {
      this.thing.member = this.thing;
      this.thing = this.thing.source;
    }
  }

  ngAfterViewInit() {
    Waves.displayEffect();
    $(this.elementRef.nativeElement).find('.tooltipped').tooltip({delay: 50});
  }

  ngOnDestroy() {
    $(this.elementRef.nativeElement).find('.tooltipped').tooltip('remove');
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
      Materialize.toast('Joined goal', 4000);
    });
  }

  joined() {
    return this.info.getInforUser() && _.any(this.thing.in, j => j.target.id === this.info.getInforUser().id);
  }

}
