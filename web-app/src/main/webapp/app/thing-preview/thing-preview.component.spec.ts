import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingPreviewComponent } from './thing-preview.component';

describe('ThingPreviewComponent', () => {
  let component: ThingPreviewComponent;
  let fixture: ComponentFixture<ThingPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
