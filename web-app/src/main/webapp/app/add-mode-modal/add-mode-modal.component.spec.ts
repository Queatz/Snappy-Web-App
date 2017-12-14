import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModeModalComponent } from './add-mode-modal.component';

describe('AddModeModalComponent', () => {
  let component: AddModeModalComponent;
  let fixture: ComponentFixture<AddModeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
