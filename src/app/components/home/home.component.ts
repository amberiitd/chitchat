import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { DataService } from 'src/app/service/data.service';
import { OutMessage, InMessage } from '../../model/message.model';
import { People } from '../../model/people.model';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public msgList: Array<InMessage>= [];
  public newmsg: string = "";
  public userId: string= "";
  public defaultScrollDown = true;
  public peopleList: Array<People> =[];

  public messages: Array<InMessage> = [
    {
      from: 'you',
      text: 'frist message text',
      timestamp: 'day/time'
    },
    {
      from: 'other',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'other',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'you',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'you',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'other',
      text: 'message text',
      timestamp: 'day/time'
    },
    
    {
      from: 'other',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'other',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'you',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'you',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'other',
      text: 'last message text',
      timestamp: 'day/time'
    },
    
    {
      from: 'other',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'you',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'you',
      text: 'message text',
      timestamp: 'day/time'
    },
    {
      from: 'other',
      text: 'last message text',
      timestamp: 'day/time'
    },
  ]

  constructor(
    private readonly messageService: MessageService,
    private readonly dataService: DataService
  ) { }

  ngOnInit(): void {
    this.messageService.nextMessageSubject.subscribe(
      msg =>{
        this.msgList.push(msg);
      }
    )

    this.dataService.getConversations( (convList: Array<People>) =>{
      this.peopleList.push(...convList);
    })
  }

  connect(){
    this.messageService.connect(this.userId);
    this.userId ="";
  }

  disconnect(){
    this.messageService.disconnect();
  }

  send(){
    if (isEmpty(this.newmsg.trim())){
      return;
    }

    this.messageService.send(
      {
        from: "you",
        to: "all",
        text: this.newmsg,
        timestamp: this.getTimeNow()

      } as OutMessage
    )

    this.newmsg = "";
  }

  sendToUser(){
    if (isEmpty(this.newmsg.trim())){
      return;
    }

    this.messageService.sendToUser(
      this.userId,
      {
        from: "you",
        to: "all",
        text: this.newmsg,
        timestamp: this.getTimeNow()

      } as OutMessage
    )

    this.newmsg = "";
    this.userId ="";
  }

  getTimeNow(){
    var currentdate = new Date(); 
    return currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
  }
  scrollHandler(event: any){
    this.defaultScrollDown = false;
  }

  onConvSelect(convId: string){
    console.log(convId);
  }

}
