import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxTopBarComponent } from './chat-box-top-bar.component';

describe('ChatBoxBotBarComponent', () => {
  let component: ChatBoxTopBarComponent;
  let fixture: ComponentFixture<ChatBoxTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBoxTopBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBoxTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
