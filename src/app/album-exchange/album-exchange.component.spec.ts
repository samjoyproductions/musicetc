import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumExchangeComponent } from './album-exchange.component';

describe('AlbumExchangeComponent', () => {
  let component: AlbumExchangeComponent;
  let fixture: ComponentFixture<AlbumExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
