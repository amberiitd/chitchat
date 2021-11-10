import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { isEmpty } from 'lodash';
import { defaultUser, User } from 'src/app/model/User.model';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { formatTime } from 'src/app/util/util-method';
import { OutMessage, InMessage } from '../../model/message.model';
import { People, PeopleDTO } from '../../model/people.model';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollToEnd') private myScrollContainer: ElementRef;

  public currentUser: User = defaultUser;
  public msgList: Array<InMessage>= [];
  public newmsg: string = "";
  public defaultScrollDown = true;

  public peopleList: Array<People> =[];
  public searchedConvList: Array<People> =[];

  public selectedConv: any;
  public connectionStatus: 'disconnected' | 'connected' | 'loading' = 'loading';
  public firstColumn: 'conv' | 'contact' = 'conv';
  public contacts: Array<People> = [];
  public searchedContacts: Array<People> = [];

  public messages: Array<InMessage> = []
  public msgSearchResult: Array<InMessage> = []
  
  public formatTime = formatTime;

  constructor(
    private readonly messageService: MessageService,
    private readonly dataService: DataService,
    public readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    
    this.init();
    this.authService.authSubject.subscribe(
      input =>{
        this.init();
      }
    )

    this.messageService.nextMessageSubject.subscribe(
      msg =>{
        this.msgList.push(msg);
      }
    )
  }

  ngAfterViewChecked(): void {
    if( this.defaultScrollDown){
      this.defaultScrollDown = false;
      this.scrollToBottom();
    }
  }

  init(){
    this.authService.getCurrentUser(
      user =>{
        this.currentUser = user;
      }
    )
    
    this.refreshConnection();

    this.messageService.nextMessageSubject.subscribe(
      msg =>{
        const index = this.peopleList.findIndex(conv => conv.publicUsername === msg.from );
        if (index >= 0 ){
          if (this.peopleList[index].init){
            this.peopleList[index].messages.push(msg);

            if(this.selectedConv.publicUsername === this.peopleList[index].publicUsername){
              this.defaultScrollDown = true;
              this.messageService.notify(
                {
                  type: "msg_seen", 
                  from: this.selectedConv.publicUsername, 
                  to: this.currentUser.publicUsername
                }
              );
            }
          }else{
            this.peopleList[index].unseenCount +=1;
          }
          this.peopleList[index].lastMessage = msg;
        }

      }
    )
  }

  disconnect(){
    this.messageService.disconnect();
  }

  refreshConnection(){
    this.messageService.connect(
      input => {
        this.connectionStatus = 'connected';
        this.dataService.getConversations( (dtoList: Array<PeopleDTO>) =>{
          this.peopleList = [];
          dtoList.forEach(
            dto =>{
              const conv: People ={
                ...dto,
                init: false,
                messages: []
              };
    
              this.peopleList.push(conv);
            }
          )
        });
      },
      input => {
        this.connectionStatus = 'disconnected';
      }
    );
  }

  sendToUser(msgText: string){
    if (isEmpty(msgText.trim())){
      return;
    }

    const inMsg: InMessage = {
      from: this.currentUser.publicUsername,
      text: msgText,
      timestamp: this.getTimeNow()

    }
    const outMsg: OutMessage ={
      ...inMsg,
      to: this.selectedConv.publicUsername
    }

    if(!this.selectedConv.messages){
      //add to conv 
      this.selectedConv.messages= []
      this.messages = this.selectedConv.messages;
      this.peopleList.splice(0, 0, this.selectedConv);
      this.dataService.saveConv(this.selectedConv.publicUsername, () =>{});
    }
    this.selectedConv.messages.push(inMsg);
    this.selectedConv.lastMessage = inMsg;
    this.messageService.sendToUser(outMsg);
    this.defaultScrollDown = true;

    this.newmsg = "";
  }

  getTimeNow(){
    var currentdate = new Date(); 
     return currentdate.getTime();
    // return currentdate.getDate() + "/"
    //                 + (currentdate.getMonth()+1)  + "/" 
    //                 + currentdate.getFullYear() + " @ "  
    //                 + currentdate.getHours() + ":"  
    //                 + currentdate.getMinutes() + ":" 
    //                 + currentdate.getSeconds();
  }
  scrollHandler(event: any){
    if (this.myScrollContainer.nativeElement.scrollHeight === this.myScrollContainer.nativeElement.clientHeight + this.myScrollContainer.nativeElement.scrollTop
      && this.messages[this.messages.length -1].timestamp < this.selectedConv.lastMessage.timestamp){
      this.messageService.getMsgs(
        {from: this.selectedConv.publicUsername, startTime: this.messages[this.messages.length-1].timestamp}, 
        (data: any[]) => {
          this.messages.push(...data.slice(1));
        }  
      )
    }else if(this.myScrollContainer.nativeElement.scrollTop === 0){
      this.messageService.getMsgs(
        {from: this.selectedConv.publicUsername, endTime: this.messages[0].timestamp}, 
        (data: any) => {
          this.messages=[...data, ...this.messages];
        }  
      )
    }

  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight-this.myScrollContainer.nativeElement.clientHeight;
    } catch(err) { }                 
  }

  onConvSelect(convId: string){
    console.log(convId);
    if (!this.selectedConv || this.selectedConv.publicUsername !== convId){
      if (this.selectedConv){
        this.removeConvSelectionProps();
      }
      this.selectedConv = this.peopleList.find(conv => conv.publicUsername === convId) as People;
      this.selectedConv.style = {bg: 'azure'};
      this.messages = this.selectedConv.messages;

      if(!this.selectedConv.init){
        this.selectedConv.init = true;
        this.messageService.getMsgs( {from: this.selectedConv.publicUsername},
          (msgs: Array<InMessage>) =>{
            this.selectedConv.messages.push(...msgs);
            this.messageService.notify(
                {
                  type: "msg_seen", 
                  from: this.selectedConv.publicUsername, 
                  to: this.currentUser.publicUsername
                }
              );
            this.selectedConv.unseenCount = 0;
            this.defaultScrollDown = true;
          }
        );
      }
    }
  }

  removeConvSelectionProps(){
    this.selectedConv.style= {bg: 'inherit'};
    this.selectedConv = undefined;
    this.messages = []
  }

  onContactSelect(contactId: any){
    const index = this.peopleList.findIndex(conv => conv.publicUsername === contactId);
    if(index >=0){
      this.onConvSelect(contactId);
      return;
    }

    if (this.selectedConv){
      this.removeConvSelectionProps();
    }
    this.selectedConv = this.contacts.find(conv => conv.publicUsername === contactId) as People;
    this.selectedConv.style = {bg: 'azure'};
  }

  toggleFirstColumn(event: any){
    this.dataService.getContacts( (data: any) =>{
      this.contacts = data
      this.searchedContacts =[...this.contacts]
    });
  }

  onContactSearch(text: string){
    if(text === ''){
      this.searchedContacts = [...this.contacts];
    }else{
      this.searchedContacts = this.contacts.filter(contact => contact.nickName.toLocaleLowerCase().includes(text.toLocaleLowerCase()))
    
    }
  }

  onConvSearch(text: string){
    if(text === ''){
      this.searchedContacts = [...this.contacts];
    }else{
      this.searchedContacts = this.contacts.filter(contact => contact.nickName.toLocaleLowerCase().includes(text.toLocaleLowerCase()))
    
    }
  }

  onMessageSearch(text: string){

    var lastText: any;
    const timerCallBack = () =>{
      if( lastText === text){
        this.messageService.getMsgs(
          {from: this.selectedConv.publicUsername, searchText: text}, 
          (data: any) => {
            this.msgSearchResult = data;
          }  
        )
      }else{
        lastText = text;
        setTimeout(timerCallBack, 1000);
      }
    };

    if(text === ''){
      this.msgSearchResult = [];
    }else{
      lastText = text;
      setTimeout(timerCallBack, 1000);
    }
  }

  onSearchedMsgSelect(pivotTime: number){
    this.messageService.getMsgs(
      {from: this.selectedConv.publicUsername, pivotTime: pivotTime}, 
      (data: any) => {
        this.messages = data;
      }  
    )
  }

}
