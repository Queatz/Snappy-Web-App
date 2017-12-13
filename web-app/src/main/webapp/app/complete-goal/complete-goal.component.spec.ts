import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteGoalComponent } from './complete-goal.component';

describe('CompleteGoalComponent', () => {
  let component: CompleteGoalComponent;
  let fixture: ComponentFixture<CompleteGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
