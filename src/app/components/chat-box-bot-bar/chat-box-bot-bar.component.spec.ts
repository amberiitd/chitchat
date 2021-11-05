import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxBotBarComponent } from './chat-box-bot-bar.component';

describe('ChatBoxBotBarComponent', () => {
  let component: ChatBoxBotBarComponent;
  let fixture: ComponentFixture<ChatBoxBotBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxBotBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxBotBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
