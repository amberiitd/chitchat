import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-box-bot-bar',
  templateUrl: './chat-box-bot-bar.component.html',
  styleUrls: ['./chat-box-bot-bar.component.css']
})
export class ChatBoxBotBarComponent implements OnInit {

  @Output()
  public onSubmit = new EventEmitter<any>();

  public msgTxt: string = "";
  public typingTimer: any;
  public timerLastText: any;

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    this.onSubmit.emit({ type: 'message', msgText: this.msgTxt});
    this.msgTxt ="";
  }

  textInputChange(value: any){
 
    if(!this.typingTimer){
      this.timerLastText = this.msgTxt;
      this.typingTimer =setTimeout(this.modelChangeTimer, 2000);
    }
  }

  private  modelChangeTimer = ()=>{
    if (this.timerLastText !== this.msgTxt){
      this.timerLastText = this.msgTxt;
      this.onSubmit.emit({type: 'typing'});
      this.typingTimer= setTimeout(this.modelChangeTimer, 2000);
    }else{
      this.typingTimer = undefined;
    }
  }

}
