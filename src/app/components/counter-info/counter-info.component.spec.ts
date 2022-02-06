import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterInfoComponent } from './counter-info.component';

describe('CounterInfoComponent', () => {
  let component: CounterInfoComponent;
  let fixture: ComponentFixture<CounterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
