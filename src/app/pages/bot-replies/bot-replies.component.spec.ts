import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotRepliesComponent } from './bot-replies.component';

describe('BotRepliesComponent', () => {
  let component: BotRepliesComponent;
  let fixture: ComponentFixture<BotRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotRepliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
