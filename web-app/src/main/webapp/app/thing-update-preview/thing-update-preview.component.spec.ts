import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingUpdatePreviewComponent } from './thing-update-preview.component';

describe('ThingUpdatePreviewComponent', () => {
  let component: ThingUpdatePreviewComponent;
  let fixture: ComponentFixture<ThingUpdatePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingUpdatePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingUpdatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
