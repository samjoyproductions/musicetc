import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyMixComponent } from './weekly-mix.component';

describe('WeeklyMixComponent', () => {
  let component: WeeklyMixComponent;
  let fixture: ComponentFixture<WeeklyMixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyMixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
