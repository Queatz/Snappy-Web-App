import { Injectable } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

@Injectable()
export class WorldService {

  private subs: Subject<any> = new Subject<any>();

  constructor() { }

  public emit(event: any) {
    this.subs.next(event);
  }

  public on(func: (any) => void): Subscription {
    return this.subs.subscribe(func);
  }

}
