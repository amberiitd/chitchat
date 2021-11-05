import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageletComponent } from './messagelet.component';

describe('MessageletComponent', () => {
  let component: MessageletComponent;
  let fixture: ComponentFixture<MessageletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
