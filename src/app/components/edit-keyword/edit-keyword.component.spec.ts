import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKeywordComponent } from './edit-keyword.component';

describe('EditCarouselComponent', () => {
  let component: EditKeywordComponent;
  let fixture: ComponentFixture<EditKeywordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditKeywordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
