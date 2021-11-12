import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { InMessage } from 'src/app/model/message.model';
import { People } from 'src/app/model/people.model';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-chat-box-bot-bar',
  templateUrl: './chat-box-bot-bar.component.html',
  styleUrls: ['./chat-box-bot-bar.component.css']
})
export class ChatBoxBotBarComponent implements OnInit, OnChanges {

  @Input()
  public replyToPeople: string | undefined;

  @Input()
  public replyToMessage: InMessage | undefined;

  @Output()
  public cancelReply = new EventEmitter<any>();

  @Output()
  public onSubmit = new EventEmitter<any>();



  public msgTxt: string = "";
  public typingTimer: any;
  public timerLastText: any;

  constructor(
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  submit(){
    this.onSubmit.emit({ type: 'message', msgText: this.msgTxt});
    this.msgTxt ="";
    this.cancelReply.emit({});
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
