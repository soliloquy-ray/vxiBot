import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRepliesComponent } from './chat-replies.component';

describe('ChatRepliesComponent', () => {
  let component: ChatRepliesComponent;
  let fixture: ComponentFixture<ChatRepliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRepliesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
