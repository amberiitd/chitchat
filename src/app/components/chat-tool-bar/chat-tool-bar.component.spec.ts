import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatToolBarComponent } from './chat-tool-bar.component';

describe('ChatToolBarComponent', () => {
  let component: ChatToolBarComponent;
  let fixture: ComponentFixture<ChatToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatToolBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
