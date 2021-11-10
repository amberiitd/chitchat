import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-box-bot-bar',
  templateUrl: './chat-box-bot-bar.component.html',
  styleUrls: ['./chat-box-bot-bar.component.css']
})
export class ChatBoxBotBarComponent implements OnInit {

  @Output()
  public onSubmit = new EventEmitter<string>();

  public msgTxt: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    this.onSubmit.emit(this.msgTxt);
    this.msgTxt ="";
  }
}
