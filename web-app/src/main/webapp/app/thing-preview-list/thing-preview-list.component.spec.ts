import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingPreviewListComponent } from './thing-preview-list.component';

describe('ThingPreviewListComponent', () => {
  let component: ThingPreviewListComponent;
  let fixture: ComponentFixture<ThingPreviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingPreviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingPreviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
